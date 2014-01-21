var LayerCollectionView = Backbone.View.extend({
  el: "#layers-control",
  
  initialize: function(layers) {
    this.collection = new LayerCollection(layers);

    // get the number of layers that aren't base-layers
    var totalLayers = _.filter(this.collection.models,function(layer) {
        return !layer.get("openLayer").isBaseLayer;
    });

    this.progress = new ProgressBar({current: 0, total: totalLayers.length}); // create a progress bar to show loading the non-base-layers

    this.listenTo(this.collection, 'layer:loaded', this.updateProgress); // each time a layer loads, update the progress bar
    this.listenTo(this.progress, 'progress:complete', this.clearLayers); // each time a layer loads, update the progress bar
    this.listenTo(this.collection, 'change:visibility', this.render); // each time a layers visibility status changes, re-render the view
    this.on('layers:clear', this.clearLayers, this);
    
    this.render();
  },

  render: function() {
    this.$el.html("");
    this.collection.each(function(layer){

      if(!layer.get("openLayer").isBaseLayer) {
        this.renderLayer(layer);
      }

    }, this);
    return this;
  },

  renderLayer: function(layer) {
    var layerView = new LayerView({ model: layer});
    this.$el.append(layerView.render().el);
  },

  updateProgress: function() {
    // count the number of loaded layers
    var loaded = _.filter(this.collection.models,function(layer) {
        return layer.get("loaded");
    });

    // update the progress model
    this.progress.model.set("current", loaded.length); 
  },

  clearLayers: function() {
    console.log('clearing layers');
    this.collection.each(function(layer){

      // clear the layer visibility of all non-Base-layers
      if(!layer.get("openLayer").isBaseLayer) {
        layer.set("visibility",false);
      }

    }, this);
  }

});