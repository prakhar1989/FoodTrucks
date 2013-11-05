(function() {

// Initializing globals
window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Markers: []
};

//helpers
window.template = function(id) {
    return _.template( $(id).html() );
}

window.getgeoJSONSample = function(geoJson, n) {
    return { 
        type: "FeatureCollections" ,
        features: _.sample(geoJson.features, n) 
    }
}

window.formatFoodItems = function(fooditems){
    return (_.sample(_.map(fooditems.split(':'), $.trim), 8)).join(", ")
}

App.Map = L.mapbox.map('map', 'prakhar.map-xt3ojyos');

App.Models.Truck = Backbone.Model.extend({
    getLatLng: function() { 
        return this.get('geometry')["coordinates"].reverse()
    },
    showOnMap: function() { 
        //openPopup App.Markers[i].openPopup()
    }
});

App.Collections.Trucks = Backbone.Collection.extend({
    model: App.Models.Truck
});

App.Views.Truck = Backbone.View.extend({
    tagName: "li",
    className: "truckCard",
    template: template('#truckTemplate'),
    events: {
        'click': "focusMap"
    },
    focusMap: function() {
        //var coordinates = this.model.getCoordinates();
        App.Map.setView(this.model.getLatLng(), 14);
        this.model.showOnMap();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

App.Views.Trucks = Backbone.View.extend({
    tagName: 'ul',
    id: "trucksList",
    render: function() {
        this.collection.each(function(truck){
            var truckview = new App.Views.Truck({ model: truck });
            this.$el.append(truckview.render().el)
        }, this);
        return this;
    }
});

App.Views.Tooltip = Backbone.View.extend({
    template: template('#tooltipTemplate'),
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));
        return this;
    }
});

App.Trucks = new App.Collections.Trucks();

App.Map.markerLayer.on("layeradd", function(e){
    var marker = e.layer,
        feature = marker.feature;
    
    // save the markers
    App.Markers.push(marker);

    // set the tooltip content
    var tooltip = new App.Models.Truck(feature);
    var popupContent = new App.Views.Tooltip({ model: tooltip }).render().el;
    marker.bindPopup(popupContent, { closeButton: true });
});

// setting up geoJSON - select a random 30 sample, which can be ratings driven later on
window.jsonsample = getgeoJSONSample(geoJson, 30);
App.Map.markerLayer.setGeoJSON(jsonsample);

// Hooking up data
var trucks = new App.Collections.Trucks(jsonsample.features);
var trucksView = new App.Views.Trucks({ collection: trucks });

// rendering views
$('#content').html(trucksView.render().el);
})();
