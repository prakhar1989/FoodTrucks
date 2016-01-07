var React = require('react');
var ReactDOM = require('react-dom');
var Sidebar = require('./components/Sidebar');

// setting up mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicHJha2hhciIsImEiOiJjaWZlbzQ1M2I3Nmt2cnhrbnlxcTQyN3VkIn0.uOaUAUqN2VS7dC7XKS0KkQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/prakhar/cij2cpsn1004p8ykqqir34jm8',
    //style: 'mapbox://styles/mapbox/streets-v8',
    center: [-122.44, 37.77],
    zoom: 12
});

ReactDOM.render(
    <Sidebar map={map} />,
    document.getElementById("sidebar")
);

map.on('style.load', function() {
    console.log("map has been loaded");
});
