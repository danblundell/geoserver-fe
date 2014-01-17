$(function(){
  var layers = [
    { title: "Public Spaces", name: "NBC:PublicOpenSpaces" },
    { title: "Parish Boundaries", name: "NBC:ParishBoundaries" },
    { title: "CCTV Cameras", name: "NBC:CCTV" }
  ];

  var layerCollection = new LayerCollection(layers);
  var layerView = new LayerCollectionController(layerCollection);
  var map = new MapView(layerCollection);

});