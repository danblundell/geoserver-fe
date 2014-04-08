var app = app || {
    Model: {},
    View: {},
    Collection: {}
};

app.Model.Layer = Backbone.Model.extend({
    defaults: {
        type: "WMS",
        showControl: true,
        visibility: false,
        loaded: false,
        enabled: false
    },

    initialize: function(layer) {

        var self = this;
        var ol = {
            title: layer.name,
            options: {}, 
            params: {}
        };
        var lay;
        // set the layers default option
        ol.options.visibility = this.defaults.visibility;

        if (layer.type === "WMS") {
            ol.type = layer.type;

            ol.params.layers = layer.name;
            ol.params.styles = "";
            ol.params.tiled = true;
            ol.params.exceptions = "application/json";
            ol.params.strategies = [new OpenLayers.Strategy.Fixed({preload: true})];
            ol.params.tileSize = new OpenLayers.Size(256,256);

            ol.options = {
                        buffer: 0,
                        displayOutsideMaxExtent: true,
                        isBaseLayer: true,
                        yx: {
                            "EPSG:27700": true
                        }
                    };


            lay = new OpenLayers.Layer[ol.type](
                ol.title,
                layer.service,
                ol.params,
                ol.options
            );

            this.set("openLayer", lay);
        } else {
            ol.type = "Vector";

            // create the style object for the vector
            var style = new OpenLayers.StyleMap({
                rendererOptions: {yOrdering: true}
            });

            // add the style to the configured attributes
            ol.options.styleMap = style;
            
            // create the vector protocol object
            var protocol = new OpenLayers.Protocol.WFS({
                            "featureType": layer.title,
                            "url": "http://localhost:8080/geoserver/wfs",
                            "geometryName": "the_geom",
                            "featurePrefix": "WebMapping",
                            "srsName": "EPSG:27700",
                            "version": "1.1.0"
                        });

            ol.options.protocol = protocol;

            ol.options.visibility = this.defaults.visibility;

            // add strategy
            ol.options.strategies = [new OpenLayers.Strategy.Fixed({
                preload: true
            })];

            ol.options.tileSize = new OpenLayers.Size(256,256);

            lay = new OpenLayers.Layer[ol.type](
                layer.title,
                ol.options
            );

            this.set("openLayer", lay);

            var sldUrl = "http://localhost:8080/geoserver/styles/"+layer.title+".sld";

            OpenLayers.Request.GET({
                url: sldUrl,
                success: function(req) {
                    var format = new OpenLayers.Format.SLD();
                    self.sld = format.read(req.responseText || req.responseXML);
                    var style = self.sld.namedLayers[layer.title].userStyles[0];
                    self.get("openLayer").styleMap.styles["default"] = style;
                    
                }
            });
        }
    },
    showLayer: function() {
        this.set("visibility", true);
        this.get("openLayer").setVisibility(true);
    },

    hideLayer: function() {
        this.set("visibility", false);
        this.get("openLayer").setVisibility(false);
    },

    disableLayer: function() {
        this.set("enabled", false);
    },

    enableLayer: function() {
        this.set("enabled", true);
    },

    getSld: function(sldUrl) {
        var self = this;
        
    },

    processSld: function(req) {
        
    }

});