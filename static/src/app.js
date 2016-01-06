var React = require('react');
var ReactDOM = require('react-dom');

// setting up mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoicHJha2hhciIsImEiOiJjaWZlbzQ1M2I3Nmt2cnhrbnlxcTQyN3VkIn0.uOaUAUqN2VS7dC7XKS0KkQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/prakhar/cij2cpsn1004p8ykqqir34jm8',
    center: [-122.37, 37.73],
    zoom: 11
});
