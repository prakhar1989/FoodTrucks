var React = require('react');
var request = require('superagent');
var Intro = require('./Intro');
var Vendor = require('./Vendor');

var Sidebar = React.createClass({
  getInitialState() {
    return { 
      results: [], 
      query: "", 
      firstLoad: true
    }
  },
  fetchResults() {
    var results = [], query = this.state.query;
    request
      .get('/search?q=' +  query)
      .end(function(err, res) {
        if (err) {
          alert("error in fetching response");
        }
        else {
          this.setState({ 
            results: res.body,
            firstLoad: false
          });
          this.plotOnMap();
        }
      }.bind(this));
  },
  generateGeoJSON(markers) {
    return {
      "type": "FeatureCollection",
      "features": markers.map(function(p) {
        return {
          "type": "Feature",
          "properties": {
            "name": p.name,
            "hours": p.hours,
            "address": p.address,
            "point-color": "253,237,57,1"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [parseFloat(p.location.longitude), 
                            parseFloat(p.location.latitude)]
          }
        }
      })
    }
  },
  plotOnMap(vendor) {
    var map = this.props.map;
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
    var highlightMarkers, usualMarkers, usualgeoJSON, highlightgeoJSON;
    
    if (vendor) {
      highlightMarkers = markers.filter(m => m.name.toLowerCase() === vendor.toLowerCase());
      usualMarkers = markers.filter(m => m.name.toLowerCase() !== vendor.toLowerCase());
    } else {
      usualMarkers = markers;
    }

    usualgeoJSON = this.generateGeoJSON(usualMarkers);
    if (highlightMarkers) {
      highlightgeoJSON = this.generateGeoJSON(highlightMarkers);
    }
    
    // clearing layers
    if (map.getLayer("trucks")) {
        map.removeLayer("trucks");
    }
    if (map.getSource("trucks")) {
        map.removeSource("trucks");
    }
    if (map.getLayer("trucks-highlight")) {
        map.removeLayer("trucks-highlight");
    }
    if (map.getSource("trucks-highlight")) {
        map.removeSource("trucks-highlight");
    }

    map.addSource("trucks", {
      "type": "geojson",
      "data": usualgeoJSON
    }).addLayer({
        "id": "trucks",
        "type": "circle",
        "interactive": true,
        "source": "trucks",
        "paint": {
          'circle-radius': 8,
          'circle-color': 'rgba(253,237,57,1)'
        },
    });

    if (highlightMarkers) {
      map.addSource("trucks-highlight", {
        "type": "geojson",
        "data": highlightgeoJSON
      }).addLayer({
          "id": "trucks-highlight",
          "type": "circle",
          "interactive": true,
          "source": "trucks-highlight",
          "paint": {
            'circle-radius': 8,
            'circle-color': 'rgba(164,65,99,1)'
          },
      });
    }
  },
  handleSearch(e) {
      e.preventDefault();
      this.fetchResults();
  },
  onChange(e) {
      this.setState({query: e.target.value});
  },
  handleHover(vendorName) {
      console.log("here");
      this.plotOnMap(vendorName);
  },
  render() {
    if (this.state.firstLoad) {
      return ( 
        <div>
          <div id="search-area">
            <form onSubmit={this.handleSearch}>
              <input type="text" value={query} onChange={this.onChange}
                      placeholder="Burgers, Tacos or Wraps?"/>
              <button>Search!</button>
            </form>
          </div>
          <Intro />
        </div>
      );
    }

    var query = this.state.query;
    var resultsCount = this.state.results.hits || 0;
    var locationsCount = this.state.results.locations || 0;
    var results = this.state.results.trucks || [];
    var renderedResults = results.map((r, i) => 
      <Vendor key={i} data={r} handleHover={this.handleHover} />
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
