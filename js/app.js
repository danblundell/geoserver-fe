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
        "layers": {
            "base": [{
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

                }
                /*, {
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
                    "isBaseLayer": true,
                    "maxResolution": 6.103515626,
                    "yx": {
                        "EPSG:27700": false
                    }
                }
            }*/
            ],
            "overlays": [{
                "title": "First Set",
                "layers": [{
                    "title": "Enterprise Zones",
                    "name": "EnterpriseZoneSites",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#0000ff",
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
                }]
            }] //layergroup
        } //layers
    }; // data 

    window.nbcMapApp = new app.View.MapView(data);

});