from elasticsearch import Elasticsearch
from flask import Flask, jsonify, request, render_template
es = Elasticsearch()

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/debug')
def test_es():
    resp = {}
    try:
        msg = es.cat.indices()
        resp["msg"] = msg
        resp["status"] = "success"
    except:
        resp["status"] = "failure"
        resp["msg"] = "Unable to reach ES"
    return jsonify(resp)

def formatFooditems(string):
    items = [x.strip().lower() for x in string.split(":")]
    return items

@app.route('/search')
def search():
    key = request.args.get('q')
    if not key:
        return jsonify({
            "status": "failure",
            "msg": "Please provide a query"
        })
    try:
        res = es.search(
                index="sfdata",
                body={
                    "query": {"match": {"fooditems": key}},
                    "size": 750 # TODO: shouldn't be hardcoded
              })
    except Exception as e:
        return jsonify({
            "status": "failure",
            "msg": "error in reaching elasticsearch"
        })
    # filtering results
    vendors = set([x["_source"]["applicant"] for x in res["hits"]["hits"]])
    temp = {v: [] for v in vendors}
    fooditems = {v: "" for v in vendors}
    for r in res["hits"]["hits"]:
        applicant = r["_source"]["applicant"]
        if "location" in r["_source"]:
            truck = {
                "hours"    : r["_source"].get("dayshours", "NA"),
                "schedule" : r["_source"].get("schedule", "NA"),
                "address"  : r["_source"].get("address", "NA"),
                "location" : r["_source"]["location"]
            }
            fooditems[applicant] = r["_source"]["fooditems"]
            temp[applicant].append(truck)

    # building up results
    results = {"trucks": []}
    for v in temp:
        results["trucks"].append({
            "name": v,
            "fooditems": formatFooditems(fooditems[v]),
            "branches": temp[v]
        })
    hits = len(results["trucks"])
    locations = sum([len(r["branches"]) for r in results["trucks"]])

    return jsonify({
        "trucks": results["trucks"],
        "hits": hits,
        "locations": locations,
        "status": "success"
    })

if __name__ == "__main__":
    app.run(debug=True)
