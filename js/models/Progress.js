// js/models/Progress.js

var Progress = Backbone.Model.extend({
  defaults: {
    current: 0,
    total: 0,
    complete: false
  }
});