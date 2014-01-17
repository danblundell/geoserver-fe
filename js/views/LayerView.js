var LayerView = Backbone.View.extend({
    tagName: "li",
    template: $("#layerTemplate").html(),

    events: {
      "click input": "toggleLayer"
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
      console.log(this.model.get("title")+" visibility set to "+this.model.get("visibility"));
    }
});