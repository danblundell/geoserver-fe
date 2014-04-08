var app = app || {};

app.View.LayerGroupCollectionView = Backbone.View.extend({
    className: ".layerGroup",
    el: "#layers-control",

    events: {
        "click .js-accordion-title": "accordionize"
    },

    initialize: function(layerGroups, serviceUrl) {
        this.serviceUrl = serviceUrl;

        // create the collection to hold our layer group models
        this.collection = new app.Collection.LayerGroupCollection(layerGroups);

        // add the service url to each layer group
        this.collection.each(function(layerGroup) {
            layerGroup.set("serviceUrl", serviceUrl);
        }, this);

        // get all the layers from all the groups
        var totalLayers = 0;

        // for each layer group model
        // this.collection.each(function(layerGroup){
        //    totalLayers += layerGroup.layers.length;
        // },this);

        //set up a progress bar to show the layer loading progress
        // this.progress = new app.View.ProgressBar({
        //     current: 0,
        //     total: totalLayers
        // });

        // listens to the event chain through the collections
        this.listenTo(this.collection, "layer:loaded", this.updateProgress);

        
        this.render();
    },

    getLayers: function() {
        var layers = [];

        this.collection.each(function(model) {
            var collection = model.get("layerCollection").collection; // layer
            layers = layers.concat(collection.models);
        });

        return layers;
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
        // count the number of loaded layers
        var loaded = _.filter(this.getLayers(), function(layer){
            return layer.get("loaded");
        });

        // update the progress model
        //this.progress.model.set("current", loaded.length);
    },

    accordionize: function(e) {
        e.preventDefault();
        console.log("clicked accordion title");
        if(!this.$el.find(e.target).parent().hasClass("active")) {
            this.$el.find(".js-accordion-title").parent().removeClass("active");
            this.$el.find(e.target).parent().addClass("active");    
        } else {
            this.$el.find(".js-accordion-title").parent().removeClass("active");
        }
        
    } 

});