import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "./components/Sidebar";

// setting up mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoicHJha2hhciIsImEiOiJjaWZlbzQ1M2I3Nmt2cnhrbnlxcTQyN3VkIn0.uOaUAUqN2VS7dC7XKS0KkQ";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/prakhar/cij2cpsn1004p8ykqqir34jm8",
  center: [-122.44, 37.77],
  zoom: 12,
});

ReactDOM.render(<Sidebar map={map} />, document.getElementById("sidebar"));

function formatHTMLforMarker(props) {
  var { name, hours, address } = props;
  var html =
    '<div class="marker-title">' +
    name +
    "</div>" +
    "<h4>Operating Hours</h4>" +
    "<span>" +
    hours +
    "</span>" +
    "<h4>Address</h4>" +
    "<span>" +
    address +
    "</span>";
  return html;
}

// setup popup display on the marker
map.on("click", function (e) {
  const features = map.queryRenderedFeatures(e.point, 
    { layers: ['trucks', 'trucks-highlight'], radius: 10, includeGeometry: true });
  if (!features.length) {
      return;
  } else {
    const feature = features[0];
    new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(formatHTMLforMarker(feature.properties))
      .addTo(map);
  }
});
