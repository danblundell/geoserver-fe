var LayerView = Backbone.View.extend({
    tagName: "li",
    template: $("#layerTemplate").html(),

    events: {
      "click input": "toggleLayer"
    },

    initialize: function() {
      var layer = this.model.get("openLayer");
      layer.events.register("loadstart", this, this.layerLoading);
      layer.events.register("loadend", this, this.layerLoaded);
      layer.events.register("change:visibility", this, this.toggleLayer);
      this.render();
    },

    render: function() {
      //parse the template
      var templ = _.template(this.template);

      // set this elements html to the model rendered in the template
      this.$el.html(templ(this.model.toJSON()));
      return this;
    },

    toggleLayer: function(e) {
      // toggle the models visibility property
      this.model.set("visibility",this.$el.find('input[type="checkbox"]')[0].checked);
    },

  layerLoading: function(e) {
    this.model.trigger('layer:loading');
  },

  layerLoaded: function(e) {
    console.log("layer loaded");
    this.model.set("loaded", true);
    this.model.trigger('layer:loaded');
    this.render();
  }


});