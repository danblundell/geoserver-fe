var ProgressBar = Backbone.View.extend({
    el: "#pro",
    template: $("#progressBarTemplate").html(),

    initialize: function(obj) {
      this.model = new Progress(obj);
      this.model.on("change:current", this.updateProgress, this);
      this.on("progress:complete",this.log, this);
      this.render();
      //this.trigger("progress:complete");
    },

    render: function() {

      //parse the template
      var templ = _.template(this.template);

      // set this elements html to the model rendered in the template
      this.$el.html(templ(this.model.toJSON()));
      return this;
    },

    updateProgress: function() {
      console.log("updating progress");
      if(this.model.get("current") < this.model.get("total")) {
        this.render();
      }
      if(this.model.get("current") == this.model.get("total")) {
        console.log("progress complete");
        this.trigger('progress:complete');
        this.$el.fadeOut();
      }
    },

    log: function() {
      console.log("progress bar finished");
    }
});