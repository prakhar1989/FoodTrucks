(function() {

// Initializing globals
window.App = {
    Models: {},
    Collections: {},
    Views: {}
};

window.template = function(id) {
    return _.template( $(id).html() );
}

App.Map = L.mapbox.map('map', 'prakhar.map-xt3ojyos');

App.Models.Truck = Backbone.Model.extend({
    defaults: {
      geometry: { type: "Point", coordinates: [0, 0] }, 
      type: "Feature", 
      properties: {
        fooditems: "None", 
        address: "NA", 
        title: "New Truck", 
        "marker-symbol": "restaurant", "marker-size": "small"
      }
    },
    getCoordinates: function() {
        return this.get('geometry')["coordinates"].reverse();
    }
});

App.Collections.Trucks = Backbone.Collection.extend({
    model: App.Models.Truck
});

App.Views.Truck = Backbone.View.extend({
    tagName: "li",
    template: template('#truckTemplate'),
    events: {
        'click': "focusMap"
    },
    focusMap: function() {
        var coordinates = this.model.getCoordinates();
        App.Map.setView(coordinates, 16);
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

// adding custom popups
App.Map.markerLayer.on("layeradd", function(e){
    var marker = e.layer,
        feature = marker.feature;
    var tooltip = new App.Models.Truck(feature);
    var popupContent = new App.Views.Tooltip({ model: tooltip }).render().el;
    marker.bindPopup(popupContent, { closeButton: true });
});

// setting up geoJSON
App.Map.markerLayer.setGeoJSON(geoJson);

// Hooking up data
var trucks = new App.Collections.Trucks(geoJson.features);
var trucksView = new App.Views.Trucks({ collection: trucks });

// rendering views
$('#content').html(trucksView.render().el);
})();
