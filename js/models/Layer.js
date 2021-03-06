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
        enabled: false,
        legend: false
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

            // remove the spaces from the layer title
            var layerTitle = this.trim(layer.title);

            // create the vector protocol object
            var protocol = new OpenLayers.Protocol.WFS({
                            "featureType": layerTitle,
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

            var sldUrl = "http://localhost:8080/geoserver/styles/"+layerTitle+".sld";

            OpenLayers.Request.GET({
                url: sldUrl,
                success: function(req) {
                    var format = new OpenLayers.Format.SLD();
                    self.sld = format.read(req.responseText || req.responseXML);
                    var style = self.sld.namedLayers[layer.title].userStyles[0];
                    self.get("openLayer").styleMap.styles["default"] = style;
                    self.setLegend();
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

    colorLuminance: function(hex, opacity) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        
        opacity = opacity || 1;

        // convert to decimal and construct rgba value
        var rgba = "rgba(", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            rgba += (c + ",");
        }

        // add alpha value
        rgba += (opacity + ");");

        return rgba;
    },

    setLegend: function() {
        var self = this,
            layerStyle = this.get("openLayer").styleMap.styles["default"],
            rules = layerStyle.rules,
            legend = [];

        _.each(rules,function(rule) {
            
            var legendItem = {
                name: rule.filter ? rule.filter.value : "default",
                properties: []
            };

            var ruleStyles = rule.symbolizer;

            for (var style in ruleStyles) {

                var styleObj = ruleStyles[style];

                for(var prop in styleObj) {

                    switch (prop) {
                        case "fillColor":
                            legendItem.properties.push("background-color:" + styleObj[prop] + ";");
                        break;
                        case "fillOpacity":
                            if(styleObj.fillColor) {
                                var bgColour = self.colorLuminance(styleObj.fillColor, styleObj[prop]);
                                legendItem.properties.push("background-color:" + bgColour + ";");
                            }
                        break;
                        case "strokeColor":
                            legendItem.properties.push("border-color:" + styleObj[prop] + ";");
                        break;
                        case "strokeWidth":
                            legendItem.properties.push("border-width:" + styleObj[prop] + "px;");
                        break;
                        case "strokeDashstyle":
                            legendItem.properties.push("border-style: dashed;");
                        break;
                    }  

                }

                legendItem.css = legendItem.properties.join(" ");
            }

            legend.push(legendItem);

        });
        this.set("legend", legend);
    },

    trim: function(str) {
        str = str.replace(/\s+/g, "");
        return str;
    }

});