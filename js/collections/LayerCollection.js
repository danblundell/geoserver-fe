var LayerCollection = Backbone.Collection.extend({
    model: Layer,
    initialize: function(arr) {
      this.items = arr;
      this.on("add", this.updateSet, this);
    },
    updateSet: function() {
      this.items = this.models;
    }
});