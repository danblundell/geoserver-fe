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

        // set the map options from the config argument
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

        // set the model
        this.model = new app.Model.Map(mapOptions);

        // cache a reference to the map object to save lookups
        this._map = this.model.get("openLayerMap");

        // create the base layers
        this.model.set("baseLayers", new app.View.LayerCollectionView(config.layers.base, config.wmsService));

        // create the overlay layers
        this.model.set("overlays", new app.View.LayerGroupCollectionView(config.layers.overlays, config.wmsService));

        // create some measuring controls and attach them to the map
        this.model.set("measuringControls", new app.View.MeasuringToolCollectionView(this._map));

        // attach the layers to the open layers map object
        this.addLayers();

        // add some controls to the map
        this.addControls();
        
        // event listener for this._map clicks
        this._map.events.register("click", this, this.getFeatures);
        //this._map.events.register("zoomend", this, this.handleZoom);

        // event listener for layer changes
        //this.listenTo(this.model.get("overlays"), "change:visibility", this.toggleLayerVisibility);

        //render the map to the DOM
        this.render();
        this.centerMap('475579', '260488', 4);
    },

    addControls: function() {
        if(this._map) {
            this._map.addControl(
            new OpenLayers.Control.PanZoomBar({
                position: new OpenLayers.Pixel(10, 10)
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

        }
        
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

        // get base layer objects from the collection
        var layers = this.model.get("baseLayers").collection.models.map(function(model) {
            return model.get('openLayer');
        });

        // go get the overlays from the group collection view
        var overlays = this.getOpenLayers(this.getAllOverlays());

        map.addLayers(layers);
        map.addLayers(overlays);
    },


    /**
     * Gets the OpenLayers from an array of Layer models
     * @param  {Array[app.Model.Layer]} arr
     * @return {Array[OpenLayers.OpenLayer]}
     */
    getOpenLayers: function(arr) {
        return arr.map(function(model){
            return model.get('openLayer');
        });
    },

    /**
     * Creates an app.View.FeatureCollectionView
     * 
     * @param  {ClickEvent} e
     * @return {Void}
     */
    getFeatures: function(e) {

        var visibleLayers = this.getVisibleOverlays();

        var queryLayers = this.getLayerNames(visibleLayers);

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
        if (visibleLayers[0].get("openLayer").protocol.version === "1.3.0") {
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

    /**
     * Gets all layers from the Overlays attribute
     * @return Array[app.Model.Layer]
     */
    getAllOverlays: function() {
        // go get the overlays from the group collection view
        var groups = this.model.get("overlays").collection.models; // returns an array of layer groups
        
        // hold the overlay layers
        var overlays = [];

        for(var x = 0; x < groups.length; x++) {
            var overlayers = groups[x].get("layerCollection").collection.models; // gets an array of layers from the layer collection
            overlays = overlays.concat(overlayers); // adds the array from the layer group to the master array of all layers
        }

        return overlays;
    },

    /**
     * Gets all the visible overlay layers
     * @return Array[app.Model.Layer]
     */
    getVisibleOverlays: function() {
        var overlays = this.getAllOverlays();

        return _.filter(overlays, function(layer) {
            return (!layer.get("openLayer").isBaseLayer && layer.get("openLayer").getVisibility()) ? true : false;
        });
    },

    /**
     * Gets an array containing the name 
     * attribute for each of the OpenLayers
     * 
     * @param  Array[app.Model.Layer] layers
     * @return Array[String]
     */
    getLayerNames: function(layers) {
        return _.map(layers, function(layer) {
            return layer.get("name");
        });
    },

    handleZoom: function(e) {
        this.model.get("overlays").toggleLayers();
    }


});