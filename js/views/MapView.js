var MapView = Backbone.View.extend({
    //model: Map,
    el: "#map-wrapper",
    template: $("#mapTemplate").html(),

    initialize: function(mapOptions, collection) {
      this.model = new Map(mapOptions);

      // add the layers as a property of the map
      this.model.set("layers", collection);
      this.addLayers();

      // cache the map model to save lookups
      var map = this.model.get("openLayerMap");

      map.addControl(
        new OpenLayers.Control.PanZoomBar(
                {
                    position: new OpenLayers.Pixel(2, 15)
                }
        )
      );

      map.addControl(
        new OpenLayers.Control.Navigation(
                {
                  dragPanOptions: 
                    {
                      enableKinetic: true
                    }
                }
        )
      );
      //map.setCenter(new OpenLayers.LonLat(475579, 260488), 0);
      //map.addControl(new OpenLayers.Control.DragPan());


      // event listener for layer changes
      this.listenTo(this.model.get("layers"), "change:visibility", this.toggleLayerVisibility);

      //render the map to the DOM
      this.render();

      //map.addControl(new OpenLayers.Control.LayerSwitcher());
      map.zoomToMaxExtent();
    },

    render: function() {
      //parse the template
      var templ = _.template(this.template);

      // set this elements html to the model rendered in the template
      this.$el.html(templ(this.model.toJSON()));
      
      // render the map once the DOM element has been created
      this.model.get("openLayerMap").render(this.model.get("el"));
      
      return this;
    },

    addLayers: function() {
      // cache the map model to save lookups
      var map = this.model.get("openLayerMap");

      // get open layers objects from the collection
      var layers = this.model.get("layers").map(function(model){
        return model.get('openLayer');
      });

      map.addLayers(layers);

      this.model.get("layers").each(function(i,obj){
        //console.log(obj);
      })
    },

    toggleLayerVisibility: function(model, value, options) {
      console.log("MAP CHANGING layer visibility to: " + value + " for layer: ");
      console.log(model.get("openLayer"));
      
      if(!model.get("openLayer").isBaseLayer) {
        // switch layer visibility
        model.get("openLayer").setVisibility(value);
      }
      
    }
});