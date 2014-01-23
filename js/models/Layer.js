// js/models/Item.js

var Layer = Backbone.Model.extend({
    defaults: {
        type: "WMS",
        showControl: true,
        visibility: true,
        loaded: false
    },

    initialize: function(attrs) {

        if (attrs.type == "WMS") {
            attrs.params.strategies = [new OpenLayers.Strategy.Fixed({
                preload: true
            })];
            this.set("openLayer", new OpenLayers.Layer[attrs.type](
                attrs.title,
                attrs.service,
                attrs.params,
                attrs.options
            ));
        }
        if (attrs.type == "Vector") {
            console.log(attrs.options);
            this.set("openLayer", new OpenLayers.Layer[attrs.type](attrs.name, attrs.options));
            console.log(this);
        }
    }

});