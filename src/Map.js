import React from "react";
import { MapContainer, TileLayer} from "react-leaflet";
import "./Map.css";
import numeral from "numeral";
import {Circle, Popup, useMap} from "react-leaflet";
import 'leaflet/dist/leaflet.css';

const casesTypeColors = {
    cases:{
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 400, //500 
    },
    recovered:{
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 600, //400
    },
    deaths:{
        hex: "#000000",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 2000
    },
};

//draw circles on map 
export const showDataOnMap = (data, casesType ) => 
    data.map((country) => (
        <Circle
            pathOptions={{color :casesTypeColors[casesType].hex, fillColor: casesTypeColors[casesType].hex}}
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            radius={Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier}
        >
            <Popup>
                <div className="info-container">
                    <div className ="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}></div>
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                    
                </div>
            </Popup>

        </Circle>
    ));

    function ChangeView({ center, zoom }) {
        const map = useMap();
        map.setView(center, zoom);
        return null;
      }

function Map({casesType, countries, center, zoom}) {
    return (
        <div className="map">

            <MapContainer  center={center} zoom={zoom} >
                <ChangeView center={center} zoom={zoom} /> 
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                /> 

                
                {showDataOnMap(countries, casesType)}
            </MapContainer>
            
        </div>
    );
}

export default Map
