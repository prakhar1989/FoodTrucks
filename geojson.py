import json
import requests

def getData(url):
	r = requests.get(url)
	return r.json()

def convertData(data, msymbol="restaurant", msize="small"):
	data_dict = []
	for d in data:  # test for first 10
		if d.get('longitude') and d.get("latitude"):
			data_dict.append({ 
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [float(d["longitude"]),
									float(d["latitude"])]	
				},
				"properties": {
					"name": d.get("applicant", ""),
					"marker-symbol": msymbol,
					"marker-size": msize,
					"fooditems": d.get('fooditems', ""),
					"address": d.get("address", "")
				}
			})
	return data_dict 

def writeToFile(data, filename="data.geojson"):
	template = { "type": "FeatureCollections", "features": data }
	with open(filename, "w") as f:
		json.dump(template, f, indent=2)

if __name__ == "__main__":
	data = getData("http://data.sfgov.org/resource/rqzj-sfat.json")
	writeToFile(convertData(data[:40]), filename="myfile.geojson")