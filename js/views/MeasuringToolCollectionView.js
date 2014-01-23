var MeasuringToolCollectionView = Backbone.View.extend({
    el: "#tools",

    initialize: function(map) {

        this._map = map;
        this.distanceView = new StatisticView({
            title: "Measured Distance"
        }) || false;

        // can refactor to deal with elsewhere if possible
        this.getRenderer();
        this.setStyle();

        // set up the collection of measurement tools
        this.collection = new MeasuringToolCollection([{
            name: "Measure Distance",
            control: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: this.renderer,
                            styleMap: this.styleMap
                        }
                    },
                    immediate: true
                }
            )
        }, {
            name: "Measure an Area",
            control: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
                    persist: true,
                    handlerOptions: {
                        layerOptions: {
                            renderers: this.renderer,
                            styleMap: this.styleMap
                        }
                    },
                    immediate: true
                }
            )
        }, {
            name: "Find a Point",
            control: new OpenLayers.Control.DrawFeature(
                new OpenLayers.Layer.Vector("Point Layer"),
                OpenLayers.Handler.Point)


        }]);

        // add the event listeners to the controls and add the controls to the map
        this.collection.each(function(tool) {
            var control = tool.get("control");
            control.events.on({
                "measure": this.handleMeasurements,
                "measurepartial": this.handleMeasurements,
                "featureadded": this.handlePoint,
                scope: this
            });
            this._map.addControl(control);

            if (control.layer) {
                control.map.addLayer(control.layer);
            }
        }, this);

        // add the seperate event listeners to handle measuring and toggling
        //this.listenTo(this.collection, "measuringtool:measure", this, this.handleMeasurements);
        //this.listenTo(this.collection, "measuringtool:measurepartial", this, this.handleMeasurements);
        this.listenTo(this.collection, "control:changed", this.toggleControl);

        this.render();
    },

    render: function() {
        this.$el.html("");

        this.collection.each(function(tool) {
            this.renderTool(tool);
        }, this);

        return this;
    },

    renderTool: function(tool) {
        var toolView = new MeasuringToolView({
            model: tool
        });
        this.$el.append(toolView.render().el);
    },

    setStyle: function() {
        // style the sketch fancy
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#666666"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };

        var style = new OpenLayers.Style();
        style.addRules([new OpenLayers.Rule({
            symbolizer: sketchSymbolizers
        })]);

        this.styleMap = new OpenLayers.StyleMap({
            "default": style
        });
    },

    getRenderer: function() {
        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        this.renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
    },

    handleMeasurements: function(event) {
        var newStat = {
            title: "Distance",
            value: event.measure.toFixed(3),
            unit: event.units,
            sup: ""
        }
        if (event.order != 1) {
            newStat.sup = "2";
        }
        this.distanceView.updateStat(newStat);
    },

    handlePoint: function(event) {

        event.object.insertXY(event.feature.geometry.x, event.feature.geometry.y);

        var newStat = {
            title: "Coordinates",
            value: event.feature.geometry.x + "," + event.feature.geometry.y,
            unit: "",
            sup: ""
        }

        this.distanceView.updateStat(newStat);
    },

    deactivateControls: function() {
        // TODO fix how the model and rendering gets managed.
        // See js/views/MeasuringToolView.js
        this.collection.each(function(tool) {

            if (tool.get("control").layer) {
                tool.get("control").layer.destroyFeatures();
            }
            tool.get("control").deactivate();
            tool.set("active", false, {
                silent: true
            });
        });
    },

    toggleControl: function(model) {
        // silently deactivate all the controls
        this.deactivateControls();

        if (model.previous("active")) {
            model.get("control").activate();

            model.set("active", true, {
                silent: true
            });

        }

        this.render();
    }

});