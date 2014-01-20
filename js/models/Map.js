// js/models/Map.js

var Map = Backbone.Model.extend({
  defaults: {
    // map defaults
    center: 0,
    el: 'map'
  },

  initialize: function() {
    console.log('initialising');
    this.set("openLayerMap", new OpenLayers.Map({
      div: this.el,
      allLayers: true
    }));
  }

});