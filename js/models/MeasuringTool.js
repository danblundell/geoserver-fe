var MeasuringTool = Backbone.Model.extend({
	defaults: {
		name: "Measuring Tool",
		control: new OpenLayers.Control(),
		active: false
	}
});