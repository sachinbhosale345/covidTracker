import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Map, View } from 'ol';
import { GeoJSON } from 'ol/format'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, OSM } from 'ol/source'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from "ol/Overlay.js"
import { fetchCovidData } from './actions'
import './CovidTracker.css';
import 'ol/ol.css';

function CovidTracker() {
    const dispatch = useDispatch()
    const covidData = useSelector(state => state.covidTrackerReducer.covidData)
    const [mapObject, setMap] = useState();
    var vectorLayerMap = new VectorLayer();

    useEffect(() => {
        dispatch(fetchCovidData())
        setMap(
            new Map({
                layers: [new TileLayer({
                    source: new OSM()
                })],
                target: 'map',
                view: new View({
                    center: [0,0],
                    zoom: 1
                })
            })
        )
    }, [])

    const styleFunction = (feature) => {
        var geoJsonFeatureObj = locationGeoJson?.features && locationGeoJson.features.find(item => item?.id === feature?.id_);
        const totalCases = geoJsonFeatureObj?.properties?.cases;
        var radius=totalCases/25000 > 1 ? totalCases/25000 : 1
        
        var styles = {
            Point: new Style({
                image: new CircleStyle({
                    radius: radius,
                    fill: new Fill({
                        color: 'rgba(255,0, 0, 0.2)'
                    }),
                    stroke: new Stroke({
                        color: 'rgba(255, 0, 0, 0.8)',
                        width: 1
                    })
                })
            })
        };
        return styles.Point;
    };

    if (mapObject && covidData) {
        var featuresArray = []
        covidData.map((item, index) => {
            if (item.countryInfo.long && item.countryInfo.lat) {
                featuresArray.push({
                    "type": "Feature",
                    "properties": item,
                    "id": item.country,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            parseFloat(item.countryInfo.long),
                            parseFloat(item.countryInfo.lat)
                        ]
                    }
                })
            }
        })
        var locationGeoJson = {
            "type": "FeatureCollection",
            "features": featuresArray
        }

        var vectorSource = new VectorSource({
            features: new GeoJSON().readFeatures(locationGeoJson, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        });

        vectorLayerMap.setSource(vectorSource);
        vectorLayerMap.setStyle(styleFunction);
        mapObject.addLayer(vectorLayerMap);
        var overlay = new Overlay({
            element: document.getElementById('popup'),
            autoPan: true,
            positioning: 'top-left',
            autoPanAnimation: {
                duration: 250
            }
        });
        mapObject.addOverlay(overlay);
        mapObject.on("pointermove", (evt) => {
            var content = document.getElementById('popup-content');
            var popupInfo;
            var feature = mapObject.forEachFeatureAtPixel(evt.pixel, (feature) => {
                popupInfo = locationGeoJson?.features && locationGeoJson.features.find(element => element.id === feature.id_)
                return feature;
            });

            if (feature) {
                var coordinates = feature.getGeometry().getCoordinates();
                overlay.setPosition(coordinates);
                const toDoHtml = `<div>
                    <p><b id='popup-title'>${popupInfo.properties.country}</b></p>
                    <hr>
                    <div class='row'>
                    <p class='subHeading'>Total</p>
                    <p class='col-lg-7'>Cases : ${popupInfo.properties.cases}</p>
                    <p class='col-lg-5'>Active : ${popupInfo.properties.active}</p>
                    </div>
                    <div class='row'>
                    <p class='col-lg-7'>Recovered : ${popupInfo.properties.recovered}</p>
                    <p class='col-lg-5'>Deaths : ${popupInfo.properties.deaths}</p>
                    </div>
                    <div class='row'>
                    <p class='subHeading'>Today</p>
                    <p  class='col-lg-7'>Cases : ${popupInfo.properties.todayCases}</p>
                    <p  class='col-lg-5'>Deaths : ${popupInfo.properties.todayDeaths}</p>
                    </div>`;
                content.innerHTML = toDoHtml;

                var closer = document.getElementById('popup-closer');
                closer.onclick = function () {
                    overlay.setPosition(undefined);
                    closer.blur();
                };
            }
            else {
                overlay.setPosition(undefined);
            }
        });
    }
    return (
        <div id="map">
            <div id="popup" className="ol-popup">
                <p href="#" id="popup-closer" className="ol-popup-closer" />
                <div id="popup-content" />
            </div>
        </div>
    );
}

export default CovidTracker;
