var app = app || {
    Model: {},
    View: {},
    Collection: {}
};

app.Model.Map = Backbone.Model.extend({
    defaults: {
        // map defaults
        center: 0,
        el: 'map'
    },

    initialize: function(mapOptions) {
        var options = mapOptions || {
            div: this.el,
            allLayers: true
        };

        this.set("openLayerMap", new OpenLayers.Map(options));
    }

});