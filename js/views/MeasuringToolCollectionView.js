var MeasuringToolCollectionView = Backbone.View.extend({
  el: "#tools",

  initialize: function(map) {

    this._map = map;
    this.distanceView = new StatisticView({title: "Measured Distance"}) || false;

    // can refactor to deal with elsewhere if possible
    this.getRenderer();
    this.setStyle();

    // set up the collection of measurement tools
    this.collection = new MeasuringToolCollection([
    {
      name: "Measure Distance",
      control: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.Path, 
                    {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: this.renderer,
                                styleMap: this.styleMap
                            }
                        }, 
                        immediate: true
                    }
                )
    }
    ,{
      name: "Measure an Area",
      control: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.Polygon, {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: this.renderer,
                                styleMap: this.styleMap
                            }
                        }, 
                        immediate: true
                    }
                )

    }]);

    // add the event listeners to the controls and add the controls to the map
    this.collection.each(function(tool){
      var control = tool.get("control");
      control.events.on({
        "measure": this.handleMeasurements,
        "measurepartial": this.handleMeasurements,
        scope: this
      });
      this._map.addControl(control);
    }, this);

    // add the seperate event listeners to handle measuring and toggling
    this.listenTo(this.collection, "measuringtool:measure", this, this.handleMeasurements);
    this.listenTo(this.collection, "measuringtool:measurepartial", this, this.handleMeasurements);
    this.collection.on("change:active", this.activateControl, this);

    this.render();
  },

  render: function() {
    this.$el.html("");

    this.collection.each(function(tool){
        this.renderTool(tool);
    }, this);

    return this;
  },

  renderTool: function(tool) {
    var toolView = new MeasuringToolView({ model: tool});
    this.$el.append(toolView.render().el);
  },

  setStyle: function() {
    // style the sketch fancy
    var sketchSymbolizers = {
        "Point": {
            pointRadius: 4,
            graphicName: "square",
            fillColor: "white",
            fillOpacity: 1,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "#333333"
        },
        "Line": {
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColor: "#666666"
        },
        "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "#666666",
            fillColor: "white",
            fillOpacity: 0.3
        }
    };

    var style = new OpenLayers.Style();
    style.addRules([new OpenLayers.Rule({symbolizer: sketchSymbolizers})]);
    
    this.styleMap = new OpenLayers.StyleMap({"default": style});
  },

  getRenderer: function() {
    // allow testing of specific renderers via "?renderer=Canvas", etc
    var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    this.renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
  },

  handleMeasurements: function(event) {
    var newStat = {
      value: event.measure.toFixed(3),
      unit: event.units,
      sup: ""
    }
    if(event.order != 1) {
      newStat.sup = "2";
    }
    this.distanceView.updateStat(newStat);
  },

  deactivateControls: function() {
    this.collection.each(function(tool){
      tool.get("control").deactivate();
      tool.set("active", false);
    });
  },

  activateControl: function(m,v,o) {

    if(v){
      this.activeControl = m.get("control");
    
      // disable all controls
      this.deactivateControls();

      this.activeControl.activate();
    }
    
  }

});