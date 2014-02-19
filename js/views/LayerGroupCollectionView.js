var app = app || {};

app.View.LayerGroupCollectionView = Backbone.View.extend({
    el: "#layers-control",

    initialize: function(layerGroups, serviceUrl) {
        this.serviceUrl = serviceUrl;

        // create the collection to hold our layer group models
        this.collection = new app.Collection.LayerGroupCollection(layerGroups);

        // add the service url to each layer group
        this.collection.each(function(layerGroup) {
            layerGroup.set("serviceUrl", serviceUrl);
        }, this);

        // get all the layers from all the groups
        var totalLayers = [];
        var layerGroupModels = this.collection.models; // layer group collection models

        // for each layer group model
        this.collection.each(function(layerGroup){
            console.log("LAYER GROUP");
            console.log(layerGroup.get("title"));
            console.log(layerGroup);
            //this.getLayers(layerGroupM);
        },this);

        totalLayers = [1,2];
        //set up a progress bar to show the layer loading progress
        this.progress = new app.View.ProgressBar({
            current: 0,
            total: totalLayers.length
        });

        this.listenTo(this.collection, "layer:loaded", this.updateProgress);

        this.render();
    },

    getLayers: function(collection) {
        collection.each(function(model) {
                console.log("LAYER COLLECTION COLLECTION");
                console.log(model);
                console.log(model.get("title"));
                console.log(model.get("layerCollection")); // layer   
            });
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
    },

    updateProgress: function() {
        console.log("updating progress");
        // count the number of loaded layers
        // var loaded = _.filter(this.collection.models, function(layer) {
        //     return layer.get("loaded");
        // });

        // update the progress model
        //this.progress.model.set("current", loaded.length);
    },

});