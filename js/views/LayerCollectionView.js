var LayerCollectionView = Backbone.View.extend({
  el: "#layers-control",
  
  initialize: function(layerCollection) {
    this.collection = layerCollection;
    this.render();
    this.collection.on("reset", this.render, this);
  },

  render: function() {
    this.$el.html("");
    this.collection.each(function(item){
      this.renderItem(item);
    }, this)
  },

  renderItem: function(item) {
    var itemView = new LayerView({ model: item});
    this.$el.append(itemView.render().el);
  },

  addItem: function() {
    var data = {};
    $("#add").children('input[type="text"]').each(function(i, el){
      data[el.id] = $(el).val();
    });
    var newItem = new Item(data);
    this.collection.add(newItem);
    this.renderItem(newItem);
  },

  filterByName: function() {
    // reset the current collection to the full list
    this.collection.reset(this.collection.items, {silent: true});

    // set the match value
    var val = $("#filter-text").val().toLowerCase();
    console.log(val);
    var filtered = _.filter(this.collection.models, function(item) {
      console.log(item.get("title").substr(val));
      return (item.get("title").toLowerCase().indexOf(val) == 0) ? true : false;
    });

    this.collection.reset(filtered);
  },

  clearFilter: function() {
    $("#filter-text").val("");
    this.collection.reset(this.collection.items);
  }

});