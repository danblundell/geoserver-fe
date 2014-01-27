var app = app || {
    Model: {},
    View: {},
    Collection: {}
};

app.Model.Layer = Backbone.Model.extend({
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
            // create the style object for the vector
            var style = new OpenLayers.StyleMap({
                'default': new OpenLayers.Style(attrs.styles.
                    default),
                rendererOptions: attrs.styles.rendererOptions,
                'select': new OpenLayers.Style(attrs.styles.select)
            });

            // add the style to the configured attributes
            attrs.options.styleMap = style;

            // create the vector protocol object
            var protocol = new OpenLayers.Protocol[attrs.options.protocolType](attrs.options.protocolOptions);
            attrs.options.protocol = protocol;

            // add strategy
            attrs.options.strategies = [new OpenLayers.Strategy.Fixed({
                preload: true
            })];

            this.set("openLayer", new OpenLayers.Layer[attrs.type](
                attrs.name,
                attrs.options
            ));
        }
    }

});