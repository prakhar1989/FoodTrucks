(function() {

var map = L.mapbox.map('map', 'prakhar.map-xt3ojyos');

var geoJson = [{
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [37, -123]
    },
    properties: {
        title: 'Marker One',
        // http://mapbox.com/developers/simplestyle/
        'marker-color': '#CC0033'
    }
},
{
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [37, -122]
    },
    properties: {
        title: 'Marker Two',
        'marker-color': '#0099ff'
    }
}];


map.markerLayer.setGeoJSON(geoJson);

function resetColors() {
    for (var i=0; i < geoJson.length; i++) {
        geoJson[i].properties['marker-color'] = geoJson[i].properties['old-color'] ||
                    geoJson[i].properties['marker-color'];
    }
    map.markerLayer.setGeoJSON(geoJson);
}


map.markerLayer.on('click', function(e){
    resetColors();
    e.layer.feature.properties['old-color'] = e.layer.feature.properties['marker-color'];
    e.layer.feature.properties['marker-color'] = '#000';
    map.markerLayer.setGeoJSON(geoJson);
});

map.on('click', resetColors);

})();
