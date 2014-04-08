var app = app || {};

app.View.MapView = Backbone.View.extend({
    //model: Map,
    el: "body",
    mapEl: "#map-wrapper",
    template: $("#mapTemplate").html(),

    events: {
        "click #clearLayers": "clearLayers",
        "click .action": "toggleSidebar"
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

        // go and get base layers from Geoserver
        this.getLayersFromService(config.wmsService, this.getBaseLayersFromService, this);

        // go and get overlays from Geoserver
        this.getLayersFromService(config.wmsService, this.getOverlaysFromService, this);
        
        
        //this.model.set("sidebar", new app.View.SidebarView(this.model.get("openLayerMap")));

        // create some measuring controls and attach them to the map
        this.model.set("measuringControls", new app.View.MeasuringToolCollectionView(this._map));


        // add some controls to the map
        this.addControls();
        
        // event listener for this._map clicks
        this._map.events.register("click", this, this.getFeatures);
        this._map.events.register("zoomend", this, this.handleZoom);

        //render the map to the DOM
        this.render();
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

    /**
     * Adds the navigation controls for
     * interacting with the map.
     * Reference: OpenLayers.js
     */
    addControls: function() {
        if(this._map) {
            this._map.addControls([
                new OpenLayers.Control.PanZoomBar({
                    position: new OpenLayers.Pixel(10, 10)
                }),
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.MousePosition(),
                new OpenLayers.Control.ZoomBox({
                    alwaysZoom: true
                })
            ]);
        }

        this.model.set("addressSearch", new app.View.AddressSearchView());
        
    },

    centerMap: function(x, y, zoom) {
        this.model.get("openLayerMap").setCenter(new OpenLayers.LonLat(x, y), zoom);
    },

    addLayers: function() {
        // cache the map model to save lookups
        var map = this.model.get("openLayerMap");
        var toAdd = this.getOpenLayers(this.getAllOverlays());
        map.addLayers(toAdd);
        this.render();
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

    /**
     * Adds the overlays to the map
     * @param  {Array} layers      [an array of layer objects]
     * @param  {String} serviceUrl [the WMS service url]
     * @return {void}
     */
    getOverlaysFromService: function(layers, serviceUrl, context) {
        var overlayGroups = [];

        // filter get only the layers that are overlays
        var overlays = _.filter(layers, function(layer){
            layer.isBaseLayer = false;
            return layer.prefix === "NBC";
        });

        // get a unique list of possible layer categories
        var categories = _.uniq(_.map(overlays, function(layer){
            return layer.keywords[0].value;
        }));

        // create a layer group per category and add the layers to the group
        _.each(categories, function(cat){
            
            var layerGroup = {
                title: cat,
                layers: []
            };

            _.each(overlays,function(layer){
                if(layer.keywords[0].value === layerGroup.title) {
                    layerGroup.layers.push(layer);
                }
            });

            overlayGroups.push(layerGroup);
        });

        // create the overlay layers
        context.model.set("overlays", new app.View.LayerGroupCollectionView(overlayGroups, serviceUrl));
        context.addLayers();
    },

    getBaseLayersFromService: function(layers, serviceUrl, context) {
        var baseGroup = [];

        baseGroup = _.filter(layers, function(layer){
            layer.isBaseLayer = true;
            layer.type = "WMS";
            layer.service = serviceUrl;
            return layer.prefix === "Base";
        });

        var baseLayers = [];

        _.each(baseGroup, function(layer){
            var layerModel = new app.Model.Layer(layer);
            baseLayers.push(layerModel.get("openLayer"));
            
        });
            
        context._map.addLayers(baseLayers);
        context.render();
        context.centerMap('475579', '260488', 4);
    },

    /**
     * Gets all the available layers using the WMS web service
     * within Geoserver.
     * 
     * @param  {String}   serviceUrl [the base url to the wms service]
     * @param  {Function} callback   [the method to call once ajax has completed]
     * @return {Array}               [an array of layers from the WMS service]
     */
    getLayersFromService: function(serviceUrl, callback, context) {
        
        OpenLayers.Request.GET({
            url: serviceUrl + '?request=getCapabilities', 
            success: function(req) {
                var format=new OpenLayers.Format.WMSCapabilities(),
                    doc = format.read(req.responseXML);
                
                callback(doc.capability.layers, serviceUrl, context);
            }
        });
    },

    handleZoom: function(e) {
        console.log("RESOLUTION: "+this._map.getResolution());
        console.log("ZOOM: "+this._map.getZoom());
        console.log("PROJECTION: "+this._map.getProjection());
        console.log("SCALE: "+this._map.getScale());
        //this.model.get("overlays").toggleLayers();
    },

    toggleSidebar: function(e) {
        e.preventDefault();

        var $sidebar = this.$el.find(".app__sidebar");

        if($sidebar.hasClass("active")) {
            $sidebar.removeClass("active");
        } else {
            $sidebar.addClass("active");
        }
    },

    clearLayers: function(e) {
        e.preventDefault();

        var overlays = this.getAllOverlays();
        _.each(overlays, function(layerModel){
            layerModel.set("visibility", false);
        });
    }

});