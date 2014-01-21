var FeatureCollectionView = Backbone.View.extend({
  el: "#features",
  
  initialize: function(request) {

    this.collection = new FeatureCollection();

    //request the features from the server
    OpenLayers.loadURL("http://localhost:8080/geoserver/NBC/wms", request.params, this, this.response, this.response);
    OpenLayers.Event.stop(request.e);

    // listen for reset events and render the collection
    this.collection.on('reset', this.render, this);
  },

  render: function() {
    this.$el.html("");
    this.collection.each(function(feature){
        this.renderFeature(feature);
    }, this);
    return this;
  },

  renderFeature: function(feature) {
    var featureView = new FeatureView({ model: feature});
    this.$el.append(featureView.render().el);
  },

  response: function(data) {

      // parse only the feature properties - the interesting bits
      var features = _.map($.parseJSON(data.responseText).features,function(feature){
        return feature.properties;
      });


      // reset the collection
      this.collection.reset(features);
    }

});