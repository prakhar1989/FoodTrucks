import React from "react";
import request from "superagent";
import Intro from "./Intro";
import Vendor from "./Vendor";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      query: "",
      firstLoad: true,
    };
    this.onChange = this.onChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  fetchResults() {
    request.get("/search?q=" + this.state.query).end((err, res) => {
      if (err) {
        alert("error in fetching response");
      } else {
        this.setState({
          results: res.body,
          firstLoad: false,
        });
        this.plotOnMap();
      }
    });
  }

  generateGeoJSON(markers) {
    return {
      type: "FeatureCollection",
      features: markers.map((p) => ({
        type: "Feature",
        properties: {
          name: p.name,
          hours: p.hours,
          address: p.address,
          "point-color": "253,237,57,1",
        },
        geometry: {
          type: "Point",
          coordinates: [
            parseFloat(p.location.coordinates[0]),
            parseFloat(p.location.coordinates[1]),
          ],
        },
      })),
    };
  }

  plotOnMap(vendor) {
    const map = this.props.map;
    const results = this.state.results;
    const markers = [].concat.apply(
      [],
      results.trucks.map((t) =>
        t.branches.map((b) => ({
          location: b.location,
          name: t.name,
          schedule: b.schedule,
          hours: b.hours,
          address: b.address,
        }))
      )
    );
    var highlightMarkers, usualMarkers, usualgeoJSON, highlightgeoJSON;

    if (vendor) {
      highlightMarkers = markers.filter(
        (m) => m.name.toLowerCase() === vendor.toLowerCase()
      );
      usualMarkers = markers.filter(
        (m) => m.name.toLowerCase() !== vendor.toLowerCase()
      );
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

    map
      .addSource("trucks", {
        type: "geojson",
        data: usualgeoJSON,
      })
      .addLayer({
        id: "trucks",
        type: "circle",
        interactive: true,
        source: "trucks",
        paint: {
          "circle-radius": 8,
          "circle-color": "rgba(253,237,57,1)",
        },
      });

    if (highlightMarkers) {
      map
        .addSource("trucks-highlight", {
          type: "geojson",
          data: highlightgeoJSON,
        })
        .addLayer({
          id: "trucks-highlight",
          type: "circle",
          interactive: true,
          source: "trucks-highlight",
          paint: {
            "circle-radius": 8,
            "circle-color": "rgba(164,65,99,1)",
          },
        });
    }
  }

  handleSearch(e) {
    e.preventDefault();
    this.fetchResults();
  }

  onChange(e) {
    this.setState({ query: e.target.value });
  }

  handleHover(vendorName) {
    this.plotOnMap(vendorName);
  }

  render() {
    if (this.state.firstLoad) {
      return (
        <div>
          <div id="search-area">
            <form onSubmit={this.handleSearch}>
              <input
                type="text"
                value={this.state.query}
                onChange={this.onChange}
                placeholder="Burgers, Tacos or Wraps?"
              />
              <button>Search!</button>
            </form>
          </div>
          <Intro />
        </div>
      );
    }

    const query = this.state.query;
    const resultsCount = this.state.results.hits || 0;
    const locationsCount = this.state.results.locations || 0;
    const results = this.state.results.trucks || [];
    const renderedResults = results.map((r, i) => (
      <Vendor key={i} data={r} handleHover={this.handleHover} />
    ));

    return (
      <div>
        <div id="search-area">
          <form onSubmit={this.handleSearch}>
            <input
              type="text"
              value={query}
              onChange={this.onChange}
              placeholder="Burgers, Tacos or Wraps?"
            />
            <button>Search!</button>
          </form>
        </div>
        {resultsCount > 0 ? (
          <div id="results-area">
            <h5>
              Found <span className="highlight">{resultsCount}</span> vendors in{" "}
              <span className="highlight">{locationsCount}</span> different
              locations
            </h5>
            <ul> {renderedResults} </ul>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Sidebar;
