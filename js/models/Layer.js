// js/models/Item.js

var Layer = Backbone.Model.extend({
  defaults: {
    visibility: false,
    openLayer: new OpenLayers.Layer.WMS()
  }

});