var app = app || {};


$(function() {

    var data = {
        "wmsService": "http://localhost:8080/geoserver/wms",
        "tileFormat": "image/png",
        "map": {
            "bounds": {
                "left": 400000.0,
                "bottom": 200000.0,
                "right": 500000.0,
                "top": 300000.0
            },
            "center": {
                "x": 475579,
                "y": 260488
            },
            "div": "map",
            "maxResolution": 390.625,
            "projection": "EPSG:27700",
            "units": "m",
        }/*,
        "layers": {
            "base": [{
                    "title": "SP",
                    "name": "NBC:osSpRaster",
                    "type": "WMS",
                    "params": {
                        "LAYERS": "NBC:osSpRaster",
                        "STYLES": "",
                        "tiled": true,
                        "exceptions":"application/json",
                    },
                    "options": {
                        "buffer": 0,
                        "displayOutsideMaxExtent": true,
                        "isBaseLayer": true,
                        "yx": {
                            "EPSG:27700": true
                        }
                    }

                }
            ],
            "overlays": [{
                "title": "Bereavement Services",
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
                },
                {
                    "title": "CCTV Cameras",
                    "name": "CCTVCameras",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#00ffff",
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
                            "fillOpacity": 1,
                            "strokeWidth": 3
                        }
                    },
                    "options": {
                        "displayInLayerSwitcher": false,
                        "extractAttributes": true,
                        "isBaseLayer": false,
                        "protocolType": "WFS",
                        "protocolOptions": {
                            "featureType": "CCTVCameras",
                            "url": "http://localhost:8080/geoserver/wfs",
                            "geometryName": "the_geom",
                            "featurePrefix": "WebMapping",
                            "srsName": "EPSG:27700",
                            "version": "1.1.0"
                        }
                    }
                },{
                    "title": "Public Open Space",
                    "name": "PublicOpenSpace",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#009900",
                            "fillOpacity": 0.50,
                            "strokeWidth": 0,
                            "graphicZIndex": 3
                        },
                        "rendererOptions": {
                            "yOrdering": true
                        },
                        "select": {
                            "strokeColor": "#000000",
                            "fillColor": "#009900",
                            "fillOpacity": 0.75,
                            "strokeWidth": 0
                        }
                    },
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
                }]
            },{
                "title": "Community Info",
                "layers": [{
                    "title": "Enterprise Zones 2",
                    "name": "EnterpriseZoneSites",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#ff00ff",
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
            },{
                "title": "Council Service Locations",
                "layers": [{
                    "title": "Enterprise Zones 2",
                    "name": "EnterpriseZoneSites",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#ff00ff",
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
            },{
                "title": "Environmental Health",
                "layers": [{
                    "title": "Enterprise Zones 2",
                    "name": "EnterpriseZoneSites",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#ff00ff",
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
            },{
                "title": "Health &amp; Emergency Services",
                "layers": [{
                    "title": "Enterprise Zones 2",
                    "name": "EnterpriseZoneSites",
                    "type": "Vector",
                    "styles": {
                        "default": {
                            "strokeColor": "#FFFFFF",
                            "fillColor": "#ff00ff",
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
        }*/ //layers
    }; // data 

    window.nbcMapApp = new app.View.MapView(data);

});