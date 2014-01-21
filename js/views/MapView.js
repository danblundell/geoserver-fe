var MapView = Backbone.View.extend({
    //model: Map,
    el: "body",
    mapEl: "#map-wrapper",
    template: $("#mapTemplate").html(),

    events: {
      "click #clearLayers": "clearLayers"
    },

    initialize: function(mapOptions, layers, mapEl) {

      // set some additional view properties
      this.mapEl = mapEl || this.mapEl;
      this.$mapEl = $(this.mapEl);

      // connect the view to a model
      this.model = new Map(mapOptions);
      this.model.set("layerControls", new LayerCollectionView(layers));
      this.model.set("layers", this.model.get("layerControls").collection);
      
      // add the layers as a property of the map
      this.addLayers();

      // cache the map model to save lookups
      this._map = this.model.get("openLayerMap");

      this._map.addControl(
        new OpenLayers.Control.PanZoomBar(
                {
                    position: new OpenLayers.Pixel(2, 15)
                }
        )
      );

      this._map.addControl(
        new OpenLayers.Control.Navigation(
                {
                  dragPanOptions: 
                    {
                      enableKinetic: true
                    }
                }
        )
      );

      // event listener for this._map clicks
      this._map.events.register("click", this, this.mapClick);

      // event listener for layer changes
      this.listenTo(this.model.get("layers"), "change:visibility", this.toggleLayerVisibility);

      //render the map to the DOM
      this.render();
      this.centerMap('475579', '260488',4);
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

    centerMap: function(x,y,zoom) {
      this.model.get("openLayerMap").setCenter(new OpenLayers.LonLat(x, y),zoom); 
    },

    addLayers: function() {
      // cache the map model to save lookups
      var map = this.model.get("openLayerMap");

      // get open layers objects from the collection
      var layers = this.model.get("layers").map(function(model){
        return model.get('openLayer');
      });

      map.addLayers(layers);
    },

    toggleLayerVisibility: function(model, value, options) {
      console.log("MAP CHANGING layer visibility to: " + value + " for layer: ");
      console.log(model.get("openLayer"));
      
      if(!model.get("openLayer").isBaseLayer) {
        // switch layer visibility
        model.get("openLayer").setVisibility(value);
      }
      
    },

    clearLayers: function() {
      this.model.get("layerControls").clearLayers();
    },

    mapClick: function(e) {
      console.log(this.model.get("layers"));
      var visibleLayers = _.filter(this.model.get("layers").models,function(layer) {
        console.log(layer.get("name"));
        return (!layer.get("openLayer").isBaseLayer && layer.get("openLayer").getVisibility()) ? true : false;
      });

      var queryLayers = _.map(visibleLayers, function(layer){
        return layer.get("name");
      });

      console.log(queryLayers);
      var featureRequest = {};
      featureRequest.e = e;

      featureRequest.params = {
                        REQUEST: "GetFeatureInfo",
                        EXCEPTIONS: "application/vnd.ogc.se_xml",
                        BBOX: this._map.getExtent().toBBOX(),
                        SERVICE: "WMS",
                        INFO_FORMAT: 'application/json',
                        QUERY_LAYERS: queryLayers,
                        FEATURE_COUNT: 50,
                        Layers: queryLayers,
                        WIDTH: this._map.size.w,
                        HEIGHT: this._map.size.h,
                        format: "image/png",
                        styles: this._map.layers[0].params.STYLES,
                        srs: this._map.layers[0].params.SRS
                    };

       // handle the wms 1.3 vs wms 1.1 madness
      if(this._map.layers[0].params.VERSION == "1.3.0") {
          featureRequest.params.version = "1.3.0";
          featureRequest.params.j = parseInt(e.xy.x);
          featureRequest.params.i = parseInt(e.xy.y);
      } else {
          featureRequest.params.version = "1.1.1";
          featureRequest.params.x = parseInt(e.xy.x);
          featureRequest.params.y = parseInt(e.xy.y);
      }
      this.featureView = new FeatureView(featureRequest);
      
      OpenLayers.Event.stop(e);
    }


});