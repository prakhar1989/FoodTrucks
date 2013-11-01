(function() {

var map = L.mapbox.map('map', 'prakhar.map-xt3ojyos');

// adding custom popups
map.markerLayer.on("layeradd", function(e){
    var marker = e.layer,
        feature = marker.feature;

    // create custom content
    var popupContent = '<h5>' + feature.properties.title + "</h5>" +
                        '<p class="address">' + feature.properties.address + "</p>" +
                        '<p class="fooditems">' + feature.properties.fooditems + "</p>";


    marker.bindPopup(popupContent, {
        closeButton: false,
    });
});


map.markerLayer.setGeoJSON(geoJson);


map.markerLayer.on("mouseover", function(e) {
    e.layer.openPopup();
});
map.markerLayer.on("mouseout", function(e){
    e.layer.closePopup();
});

})();
