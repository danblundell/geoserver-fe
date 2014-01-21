$(function(){

  var wmsService = "http://localhost:8080/geoserver/NBC/wms";
  var format = "image/png";
  
  var layers = [
  	{ 
  		title: "SP", 
  		name:"NBC:sp", 
  		type:"WMS", 
  		service: wmsService,
  		params: {
            LAYERS: 'NBC:sp',
            STYLES: '',
            format: format,
            tiled: true/*,
            tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom*/
        },
        options: {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: true,
            yx : {'EPSG:27700' : false}
        }
    },
    { 
    	title: "Public Spaces", 
    	name: "NBC:PublicOpenSpace", 
    	type: "WMS", 
    	service: wmsService, 
    	params: {
            LAYERS: 'NBC:PublicOpenSpace',
            STYLES: '',
            format: "image/png",
            transparent: true
        }, 
        options: {
           singleTile: false, 
           ratio: 1, 
           isBaseLayer: false,
           yx : {'EPSG:27700' : false}
        }
    },
    { 
    	title: "Parish Boundaries", 
    	name: "NBC:ParishBoundaries2013", 
    	type: "WMS", 
    	service: wmsService, 
    	params: {
            LAYERS: 'NBC:ParishBoundaries2013',
            STYLES: '',
            format: "image/png",
            transparent: true
        }, 
        options: {
	       opacity: 0.2,
	       singleTile: false, 
	       ratio: 1, 
	       isBaseLayer: false,
	       yx : {'EPSG:27700' : false}
	    }
	},
    { 
    	title: "CCTV Cameras", 
    	name: "NBC:CCTVCameras", 
    	type: "WMS", 
    	service: wmsService, 
    	params: {
            LAYERS: 'NBC:CCTVCameras',
            STYLES: '',
            format: "image/png",
            transparent: true
        },
        options: {
           singleTile: false, 
           ratio: 1, 
           isBaseLayer: false,
           yx : {'EPSG:27700' : false}
        }
    }
  ];

  var bounds = new OpenLayers.Bounds(
                    460000, 250000,
                    482000, 260000
                );

  var mapOptions = {
                    controls: [],
                    maxExtent: bounds,
                    maxResolution: 390.625,
                    projection: "EPSG:27700",
                    units: 'm',
                    div: 'map',
                    center: new OpenLayers.LonLat(475579, 260488)
                };

  var map = new MapView(mapOptions, layers);
  window.map = map;

});