var MeasuringToolView = Backbone.View.extend({
    model: MeasuringTool,
    tagName: 'li',
    className: 'measuring-tool',
    template: $("#measuringToolTemplate").html(),

    events: {
        "click button": "toggleControl"
    },

    render: function() {
        var templ = _.template(this.template);
        this.$el.html(templ(this.model.toJSON()));
        return this;
    },

    toggleControl: function(e) {
        e.preventDefault();

        if (!this.model.get("active")) {
            this.model.set("active", true);
        } else {
            this.model.set("active", false);
        }

        this.model.trigger("control:changed", this.model);
    }
});