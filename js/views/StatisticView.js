var StatisticView = Backbone.View.extend({
    model: Statistic,
    el: "#distance",
    tagName: 'li',
    className: 'stat',
    template: $("#statTemplate").html(),

    initialize: function(model) {
        this.model = new Statistic(model);
        this.render();
    },

    render: function() {
        var templ = _.template(this.template);
        this.$el.html(templ(this.model.toJSON()));
        return this;
    },

    updateStat: function(opts) {
        if (opts.value) {
            this.model.set("value", opts.value);
        }
        if (opts.unit != undefined) {
            this.model.set("unit", opts.unit);
        }
        if (opts.sup != undefined) {
            this.model.set("sup", opts.sup);
        }
        if (opts.title != undefined) {
            this.model.set("title", opts.title);
        }
        this.render();
    }

});