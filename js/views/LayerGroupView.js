var app = app || {};

app.View.LayerGroupView = Backbone.View.extend({
    className: "layerGroup",
    template: $("#layerGroupTemplate").html(),

    initialize: function() {
        this.model.set("layerCollection", new app.View.LayerCollectionView(this.model.get("layers"), this.model.get("serviceUrl")));
        this.render();
    },

    render: function() {
        //parse the template
        var templ = _.template(this.template);

        // render this views template and the child collection view too
        this.$el.html(templ(this.model.toJSON())).append(this.model.get("layerCollection").render().el);

        return this;
    }

});