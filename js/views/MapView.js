var app = app || {};

app.View.MapView = Backbone.View.extend({
    //model: Map,
    el: "body",
    mapEl: "#map-wrapper",
    template: $("#mapTemplate").html(),

    events: {
        "click #clearLayers": "clearLayers"
    },

    initialize: function(config, mapEl) {

        // set some additional view properties
        this.mapEl = mapEl || this.mapEl;
        this.$mapEl = $(this.mapEl);

        // connect the view to a model
        var mapOptions = {
            controls: [],
            maxExtent: new OpenLayers.Bounds(
                config.map.bounds.left,
                config.map.bounds.bottom,
                config.map.bounds.right,
                config.map.bounds.top),
            maxResolution: config.map.maxResolution,
            projection: config.map.projection,
            units: config.map.units,
            div: config.map.div,
            center: new OpenLayers.LonLat(config.map.center.x, config.map.center.y)
        };

        this.model = new app.Model.Map(mapOptions);

        this.model.set("layerControls", new app.View.LayerCollectionView(config.layers, config.wmsService));
        this.model.set("layers", this.model.get("layerControls").collection);


        // add the layers as a property of the map
        this.addLayers();

        // cache the map model to save lookups
        this._map = this.model.get("openLayerMap");
        this.model.set("measuringControls", new app.View.MeasuringToolCollectionView(this._map));


        this._map.addControl(
            new OpenLayers.Control.PanZoomBar({
                position: new OpenLayers.Pixel(2, 15)
            })
        );

        this._map.addControl(
            new OpenLayers.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            })
        );

        this._map.addControl(
            new OpenLayers.Control.MousePosition()
        );

        // event listener for this._map clicks
        this._map.events.register("click", this, this.mapClick);
        this._map.events.register("zoomend", this, this.handleZoom);

        // event listener for layer changes
        this.listenTo(this.model.get("layers"), "change:visibility", this.toggleLayerVisibility);

        //render the map to the DOM
        this.render();
        this.centerMap('475579', '260488', 4);
    },

    render: function() {
        //parse the template
        var templ = _.template(this.template);

        // set this elements html to the model rendered in the template
        this.$mapEl.html(templ(this.model.toJSON()));

        // render the map once the DOM element has been created
        this.model.get("openLayerMap").render(this.model.get("el"));

        return this;
    },

    centerMap: function(x, y, zoom) {
        this.model.get("openLayerMap").setCenter(new OpenLayers.LonLat(x, y), zoom);
    },

    addLayers: function() {
        // cache the map model to save lookups
        var map = this.model.get("openLayerMap");

        // get open layers objects from the collection
        var layers = this.model.get("layers").map(function(model) {
            return model.get('openLayer');
        });

        map.addLayers(layers);
    },

    toggleLayerVisibility: function(model, value, options) {

        if (!model.get("openLayer").isBaseLayer) {
            // switch layer visibility
            model.get("openLayer").setVisibility(value);
        }

    },

    clearLayers: function() {
        this.model.get("layerControls").clearLayers();
    },

    mapClick: function(e) {

        var visibleLayers = _.filter(this.model.get("layers").models, function(layer) {
            return (!layer.get("openLayer").isBaseLayer && layer.get("openLayer").getVisibility()) ? true : false;
        });

        var queryLayers = _.map(visibleLayers, function(layer) {
            return layer.get("name");
        });

        var featureRequest = {
            e: e,
            params: {
                request: "GetFeatureInfo",
                exceptions: "application/json",
                bbox: this._map.getExtent().toBBOX(),
                service: "WMS",
                info_format: 'application/json',
                query_layers: queryLayers,
                feature_count: 50,
                layers: queryLayers,
                width: this._map.size.w,
                height: this._map.size.h,
                format: "image/png",
                srs: this._map.getProjection()
            }
        };

        // handle the wms 1.3 vs wms 1.1 madness
        if (this._map.layers[1].params.VERSION == "1.3.0") {
            featureRequest.params.version = "1.3.0";
            featureRequest.params.j = parseInt(e.xy.x);
            featureRequest.params.i = parseInt(e.xy.y);
        } else {
            featureRequest.params.version = "1.1.1";
            featureRequest.params.x = parseInt(e.xy.x);
            featureRequest.params.y = parseInt(e.xy.y);
        }
        this.featureView = new app.View.FeatureCollectionView(featureRequest);
        OpenLayers.Event.stop(e);
    },

    handleZoom: function(e) {
        console.log(e.object);
        this.model.get("layerControls").toggleLayers();
    }


});