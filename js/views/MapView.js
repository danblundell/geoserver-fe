var MapView = Backbone.View.extend({
    model: Map,
    el: "#map-wrapper",
    template: $("#mapTemplate").html(),

    initialize: function(collection) {
      this.model = new Map();
      this.model.layers = collection;
      this.listenTo(this.model.layers, "change:visibility", this.updateLayer);
      this.render();
    },

    render: function() {
      //parse the template
      var templ = _.template(this.template);

      // set this elements html to the model rendered in the template
      this.$el.html(templ(this.model.toJSON()));
      return this;
    },

    updateLayer: function(model, value, options) {
      console.log("changed "+model.get("title")+" visibility to: " + value);
    }
});