var MapView = Backbone.View.extend({
    //model: Map,
    el: "#map-wrapper",
    template: $("#mapTemplate").html(),

    initialize: function(collection) {
      this.model = new Map();
      this.model.set("layers", collection);
      this.listenTo(this.model.get("layers"), "change:visibility", this.toggleLayerVisibility);
      this.render();
      
      // temp layer test
      var osm = new OpenLayers.Layer.OSM();
      this.model.get("openLayerMap").addLayers([osm]);
      this.model.get("openLayerMap").addControl(new OpenLayers.Control.LayerSwitcher());
      this.model.get("openLayerMap").zoomToMaxExtent();
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

    toggleLayerVisibility: function(model, value, options) {
      
      console.log("changed "+model.get("title")+" visibility to: " + value);

      // switch layer visibility
      // model.get("openLayer").setVisibility(value);
    }
});