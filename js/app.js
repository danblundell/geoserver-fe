$(function() {

    var wmsService = "http://localhost:8080/geoserver/NBC/gwc/service/wms";
    var format = "image/png";

    var layerStyle = new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
            strokeColor: '#FFFFFF',
            fillColor: '#336633',
            fillOpacity: .50,
            strokeWidth: 0,
            graphicZIndex: 3
        }),
        rendererOptions: {
            yOrdering: true
        },
        'select': new OpenLayers.Style({
            strokeColor: '#000000',
            fillColor: '#ff9933',
            fillOpacity: .75,
            strokeWidth: 3
        })
    });

    var layers = [{
        title: "SP",
        name: "NBC:sp",
        type: "WMS",
        service: wmsService,
        params: {
            LAYERS: 'NBC:sp',
            STYLES: '',
            format: format,
            tiled: true
            /*,
            tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom*/
        },
        options: {
            buffer: 0,
            displayOutsideMaxExtent: true,
            isBaseLayer: true,
            yx: {
                'EPSG:27700': false
            }
        }
    }, {
        title: "Enterprise Zones",
        name: "EnterpriseZoneSites",
        type: "Vector",
        options: {
            displayInLayerSwitcher: false,
            resolutions: [100, 50, 10, 5, 2.5, 1.25, .5, .25],
            styleMap: layerStyle,
            extractAttributes: true,
            isBaseLayer: false,
            strategies: [new OpenLayers.Strategy.Fixed({
                preload: true
            })],
            protocol: new OpenLayers.Protocol.WFS({
                featureType: "EnterpriseZoneSites",
                url: "http://localhost:8080/geoserver/wfs",
                geometryName: "the_geom",
                featurePrefix: "WebMapping",
                srsName: "EPSG:27700",
                version: "1.1.0"
            })
        }
    }, {
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
            yx: {
                'EPSG:27700': false
            }
        }
    }, {
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
            yx: {
                'EPSG:27700': false
            }
        }
    }, {
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
            yx: {
                'EPSG:27700': false
            }
        }
    }];

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