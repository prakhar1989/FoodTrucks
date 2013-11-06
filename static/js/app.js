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

/* ------------------------------------------------ */
App.Map = L.mapbox.map('map', 'prakhar.map-xt3ojyos');

// MODELS 
App.Models.Truck = Backbone.Model.extend({
    default: {
        pos: -1 // truck that doesnot have a marker
    },
    getLatLng: function(){
        return this.marker.getLatLng();
    },
    showOnMap: function(){
        return this.marker.openPopup();
    }
});

// COLLECTIONS
App.Collections.TrucksCollection = Backbone.Collection.extend({
    model: App.Models.Truck
});

// VIEWS
App.Views.Tooltip = Backbone.View.extend({
    template: template('#tooltipTemplate'),
    events: {
        'click': 'testClick'
    },
    testClick: function() {
        // used to capture events on the popup
    },
    render: function() {
        this.$el.html(this.template( this.model.toJSON() ));
        return this;
    }
});

App.Views.TruckView = Backbone.View.extend({
    tagName: 'li',
    className: 'truckCard',
    events: {
        'click': "focusOnMap"
    },
    focusOnMap: function(){
        App.Map.setView(this.model.marker.getLatLng(), 13);
        this.model.marker.openPopup();
    },
    template: template('#truckTemplate'),
    render: function(){
        this.$el.html(this.template( this.model.toJSON() ));
        return this;
    }
});

App.Views.TrucksCollectionView = Backbone.View.extend({
    tagName: 'ul',
    id: "trucksList",
    render: function() {
        this.collection.each(function(truck){
            var truckview = new App.Views.TruckView({ model: truck });
            this.$el.append(truckview.render().el);
        }, this);
        return this;
    }
});

// set up blank trucks collection; TODO: make this non-global
window.trucksCollection = new App.Collections.TrucksCollection();

// While adding each marker on map
App.Map.markerLayer.on("layeradd", function(e){
    var marker = e.layer,
        feature = marker.feature;
    
    // create a new truck model 
    var truck = new App.Models.Truck(feature);

    // set its property as a marker
    truck.marker = marker;
    
    // set unique ids on model and marker [ for association ] 
    marker.pos = trucksCollection.length;
    truck.set('pos', trucksCollection.length);
    
    // add it to a collection
    trucksCollection.add(truck);

    // set the tooltip content
    var popupContent = new App.Views.Tooltip({ model: truck }).render().el;
    marker.bindPopup(popupContent, { closeButton: true });
});

// on click events on the markers
App.Map.markerLayer.on('click', function(e){
    var pos = e.layer.pos;
    var model = trucksCollection.find(function(truck) {
        // get the model associated with the current marker
        return truck.get('pos') === pos 
    });

});

// setting up geoJSON - select a random 30 sample, which can be ratings driven later on
window.jsonsample = getgeoJSONSample(geoJson, 30);
App.Map.markerLayer.setGeoJSON(jsonsample);

// Setting up the sidebar
var trucksView = new App.Views.TrucksCollectionView({ collection: trucksCollection });

// rendering views
$('#content').html(trucksView.render().el);
})();
