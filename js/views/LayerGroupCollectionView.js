var app = app || {};

app.View.LayerGroupCollectionView = Backbone.View.extend({
    el: "#layers-control",

    initialize: function(layerGroups, serviceUrl) {
        this.serviceUrl = serviceUrl;

        // create the collection to hold our layer group models
        this.collection = new app.Collection.LayerGroupCollection(layerGroups);

        this.collection.each(function(layerGroup) {
            layerGroup.set("serviceUrl", serviceUrl);
        }, this);

        this.render();
    },

    render: function() {
        this.$el.html("");
        this.collection.each(function(layerGroup) {
            this.renderLayerGroup(layerGroup);
        }, this);
        return this;
    },

    renderLayerGroup: function(layerGroup) {
        var layerGroupView = new app.View.LayerGroupView({
            model: layerGroup
        });
        this.$el.append(layerGroupView.render().el);
    }

});