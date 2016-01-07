var React = require('react');
var request = require('superagent');

var Sidebar = React.createClass({
  getInitialState() {
    return { results: [], query: "" }
  },
  componentDidMount() {
    this.pointsLayer = null;
  },
  fetchResults() {
    var results = [],
        query = this.state.query;
    request
      .get('/search?q=' +  query)
      .end(function(err, res) {
        if (err) {
          alert("error in fetching response");
        }
        else {
          this.setState({ results: res.body });
          this.plotOnMap();
        }
      }.bind(this));
  },
  plotOnMap() {
    var map = this.props.map;
    if (this.pointsLayer != null) {
      map.removeLayer(this.pointsLayer);
    }
    var results = this.state.results;
    var markers = [].concat.apply([], results.trucks.map(t => 
                      t.branches.map(function(b) { 
                        return {
                          location: b.location,
                          name: t.name,
                          schedule: b.schedule,
                          hours: b.hours,
                          address: b.address
                        }
                      })));
    var geoJSON = {
      "type": "FeatureCollection",
      "features": markers.map(function(p) {
        return {
          "type": "Feature",
          "properties": {
            "name": p.name,
            "hours": p.hours,
            "address": p.address
          },
          "geometry": {
            "type": "Point",
            "coordinates": [parseFloat(p.location.longitude), 
                            parseFloat(p.location.latitude)]
          }
        }
      })
    };
    
    if (map.getLayer("trucks")) {
        map.removeLayer("trucks");
    }
    if (map.getSource("trucks")) {
        map.removeSource("trucks");
    }
    console.log(geoJSON);

    map.addSource("trucks", {
      "type": "geojson",
      "data": geoJSON
    }).addLayer({
        "id": "trucks",
        "type": "circle",
        "interactive": true,
        "source": "trucks",
        "layout": {
          "icon-image": "monument-15",
        },
        'paint': {
          'circle-radius': 8,
          'circle-color': 'rgba(253,237,57,1)'
        },
    });
  },
  handleSearch(e) {
    e.preventDefault();
    this.fetchResults();
  },
  onChange(e) {
    this.setState({query: e.target.value});
  },
  formatFoodItems(items) {
    var s = items.join(",").substr(0, 80);
    if (s.length > 70) {
      var indexOfLastSpace = s.split('').reverse().join('').indexOf(",");
      return s.substr(0, 80 - indexOfLastSpace) + " & more...";
    } else {
      return s;
    }
  },
  render() {
    var query = this.state.query;
    var resultsCount = this.state.results.hits || 0;
    var locationsCount = this.state.results.locations || 0;
    var results = this.state.results.trucks || [];
    var renderedResults = results.map((r, i) => 
      <li key={i}>
        <p className="truck-name">{ r.name }</p>
        <div className="row">
          <div className="icons"> <i className="ion-android-pin"></i> </div>
          <div className="content"> {r.branches.length} locations </div>
        </div>
        <div className="row">
          <div className="icons"> <i className="ion-fork"></i> <i className="ion-spoon"></i></div>
          <div className="content"> Serves {this.formatFoodItems(r.fooditems)}</div>
        </div>
      </li>
    );
    return (
      <div>
        <div id="search-area">
          <form onSubmit={this.handleSearch}>
            <input type="text" value={query} onChange={this.onChange}
                    placeholder="Burgers, Tacos or Wraps?"/>
            <button>Search!</button>
          </form>
        </div>
        { resultsCount > 0 ?
          <div id="results-area">
            <h5>Found <span className="highlight">{ resultsCount }</span> vendors
              in <span className='highlight'>{ locationsCount}</span> different locations</h5>
            <ul> { renderedResults } </ul>
          </div>
        : null}
      </div>
    );
  }
});

module.exports = Sidebar;
