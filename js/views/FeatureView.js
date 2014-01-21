var FeatureView = Backbone.View.extend({
    //model: Map,
    el: "#features",
    tagName: "li",
    className: ".feature",
    template: $("#featureTemplate").html(),

    initialize: function(feature) {
      this.model = new Feature(feature);

      //render the feature to the DOM
      OpenLayers.loadURL("http://localhost:8080/geoserver/NBC/wms", this.model.get("params"), this, this.response, this.response);
      this.render();
    },

    render: function() {
      //parse the template
      var templ = _.template(this.template);

      // set this elements html to the model rendered in the template
      this.$el.html(templ(this.model.toJSON()));
      
      return this;
    },

    response: function(data) {
      console.log(data);
      var features = $.parseJSON(data.responseText).features;
      var featureInfo = _.map(features,function(feature){
        return JSON.stringify(feature.properties);
      });

      this.model.set("response", featureInfo);
      this.render();
    }

    
});