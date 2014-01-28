var app = app || {};

$(function() {

    var data = {
        "wmsService": "http://localhost:8080/geoserver/NBC/gwc/service/wms",
        "tileFormat": "image/png",
        "map": {
            "bounds": {
                "left": 400000,
                "bottom": 250000,
                "right": 480000,
                "top": 300000
            },
            "center": {
                "x": 475579,
                "y": 260488
            },
            "div": "map",
            "maxResolution": 390.625,
            "projection": "EPSG:27700",
            "units": "m",
        },
        "layers": [{
            "title": "SP",
            "name": "NBC:sp",
            "type": "WMS",
            "params": {
                "LAYERS": "NBC:sp",
                "STYLES": "",
                "tiled": true
            },
            "options": {
                "buffer": 0,
                "displayOutsideMaxExtent": true,
                "isBaseLayer": true,
                "yx": {
                    "EPSG:27700": false
                }
            }
        }, {
            "title": "Vector District",
            "name": "OSVectorDistrict",
            "type": "WMS",
            "params": {
                "LAYERS": "OSVectorDistrict",
                "STYLES": "",
                "format": "image/png",
                "transparent": true
            },
            "options": {
                "singleTile": false,
                "ratio": 1,
                "isBaseLayer": false,
                "maxResolution": 6.103515626,
                "yx": {
                    "EPSG:27700": false
                }
            }
        }, {
            "title": "Enterprise Zones",
            "name": "EnterpriseZoneSites",
            "type": "Vector",
            "styles": {
                "default": {
                    "strokeColor": "#FFFFFF",
                    "fillColor": "#336633",
                    "fillOpacity": 0.50,
                    "strokeWidth": 0,
                    "graphicZIndex": 3
                },
                "rendererOptions": {
                    "yOrdering": true
                },
                "select": {
                    "strokeColor": "#000000",
                    "fillColor": "#ff9933",
                    "fillOpacity": 0.75,
                    "strokeWidth": 3
                }
            },
            "options": {
                "displayInLayerSwitcher": false,
                "resolutions": [100, 50, 10, 5, 2.5, 1.25, 0.5, 0.25],
                "extractAttributes": true,
                "isBaseLayer": false,
                "protocolType": "WFS",
                "protocolOptions": {
                    "featureType": "EnterpriseZoneSites",
                    "url": "http://localhost:8080/geoserver/wfs",
                    "geometryName": "the_geom",
                    "featurePrefix": "WebMapping",
                    "srsName": "EPSG:27700",
                    "version": "1.1.0"
                }
            }
        }, {
            "title": "Public Spaces Raster",
            "name": "NBC:PublicOpenSpace",
            "type": "WMS",
            "params": {
                "LAYERS": "NBC:PublicOpenSpace",
                "STYLES": "",
                "format": "image/png",
                "transparent": true
            },
            "options": {
                "singleTile": false,
                "ratio": 1,
                "isBaseLayer": false,
                "yx": {
                    "EPSG:27700": false
                }
            }
        }, {
            "title": "Public Spaces Vector",
            "name": "PublicOpenSpace",
            "type": "Vector",
            "options": {
                "displayInLayerSwitcher": false,
                "extractAttributes": true,
                "isBaseLayer": false,
                "protocolType": "WFS",
                "protocolOptions": {
                    "featureType": "PublicOpenSpace",
                    "url": "http://localhost:8080/geoserver/wfs",
                    "geometryName": "the_geom",
                    "featurePrefix": "WebMapping",
                    "srsName": "EPSG:27700",
                    "version": "1.1.0"
                }
            }
        }, {
            "title": "Parish Boundaries",
            "name": "NBC:ParishBoundaries2013",
            "type": "WMS",
            "params": {
                "LAYERS": "NBC:ParishBoundaries2013",
                "STYLES": "",
                "format": "image/png",
                "transparent": true
            },
            "options": {
                "opacity": 0.2,
                "singleTile": false,
                "ratio": 1,
                "isBaseLayer": false,
                "yx": {
                    "EPSG:27700": false
                }
            }
        }, {
            "title": "CCTV Cameras",
            "name": "NBC:CCTVCameras",
            "type": "WMS",
            "params": {
                "LAYERS": "NBC:CCTVCameras",
                "STYLES": "",
                "format": "image/png",
                "transparent": true
            },
            "options": {
                "singleTile": false,
                "ratio": 1,
                "isBaseLayer": false,
                "yx": {
                    "EPSG:27700": false
                }
            }
        }]
    };


    new app.View.MapView(data);

});