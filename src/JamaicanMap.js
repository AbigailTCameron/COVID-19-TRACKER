
import React, {useState} from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap} from "react-leaflet";
import { FormControl, Select, MenuItem, Card, CardContent, useScrollTrigger} from '@material-ui/core';
import './JamaicanMap.css';
import InfoBox from './InfoBox'
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import {infoOnParishes} from './jamaicaninfo';
import JamaicanTable from './JamaicanTable';
import { prettyPrint} from './util';



const caseTypeColour = {
    cases:{
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        half_op: "rgba(204, 16, 52, 0.5)",
        multiplier: 400
    },
    recovered:{
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        half_op: "rgba(125, 215, 29, 0.5)",
        multiplier: 600
    },
    deaths:{
        hex: "#000000",
        rgb: "rgb(251, 68, 67)",
        half_op: "rgba(251, 68, 67, 0.5)",
        multiplier: 2000
    }
};


  

   function ChangeView({ jamaicaCenter, jamaicaZoom }) {
        const map = useMap();
        map.setView(jamaicaCenter, jamaicaZoom);
        return null;
      }
    
    


function JamaicanMap() {

    const parishes = ["Hanover","St Elizabeth", "St James", "Trelawny", "Westmoreland", "Clarendon", "Manchester", "St Ann", "St Catherine", "St Mary", "Portland", "Kingston & St Andrew", "St Thomas"]; 
    const[parish, setParish] = useState("worldwide");
    const[jamaicaMapCenter, setJamaicaMapCenter] = useState([18.1096,-77.2975]);
    const[jamaicaMapZoom, setJamaicaMapZoom] = useState(9);
    const[jamaicaCasesType, setJamaicaCasesType] = useState("cases"); 
  


    
  
const onParishChange = (e) => {
    const parish = e.target.value;
    setParish(parish);
   if (parish === "worldwide"){
        setJamaicaMapCenter([18.1096,-77.2975]);
        setJamaicaMapZoom(9);
   }else{
        setJamaicaMapCenter([infoOnParishes[parish].lat, infoOnParishes[parish].lon]);
        setJamaicaMapZoom(10);
    
   }
};



const casesStats = (parish) => {
    var numOfCases = 0;
    if (parish !== "worldwide"){
        numOfCases = infoOnParishes[parish].cases;
     
    }else{
        parishes.map((par) =>{
            numOfCases = numOfCases+ infoOnParishes[par].cases;
        }) 
    }

   return numOfCases;
}

const recoveredStats = (parish) =>{ 
    var numOfRecovers  = 0;
    if (parish !== "worldwide"){
        numOfRecovers = infoOnParishes[parish].recovered;
    }else{
        for (let i = 0 ; i < parishes.length; i ++){
            numOfRecovers += infoOnParishes[parishes[i]].recovered;
        }
    }
    return numOfRecovers;
}

const deathStats = (parish) =>{ 
    var numOfDeaths = 0;
    if (parish !== "worldwide"){
        numOfDeaths = infoOnParishes[parish].deaths;
    }else{
        for (let i = 0 ; i < parishes.length; i ++){
            numOfDeaths += infoOnParishes[parishes[i]].deaths;
        }
    }
    return numOfDeaths;
}






    return (
        <div className = "japp">
            <div className = "japp__left">
            
                <div className ="japp__header">
                    <h1> Jamaican COVID Tracker</h1>

                        <FormControl className="japp__dropdown">
                            <Select
                                variant="outlined"
                                value={parish}
                                onChange={onParishChange}>   

                                <MenuItem value="worldwide">Parishes</MenuItem>
                                
                                {parishes.map((parish) => (
                                    <MenuItem value={parish}>{parish}</MenuItem>))}
                            </Select>
                        </FormControl>   

                </div> 

                    <div className = "japp__stats" >
                        <InfoBox 
                        onClick={(e) => setJamaicaCasesType("cases")}
                        title="Coronavirus Cases"
                        isRed
                        active={jamaicaCasesType === "cases"}
                        cases={prettyPrint(casesStats(parish))}/>

                        <InfoBox 
                            onClick={(e) => setJamaicaCasesType("recovered")}
                            title="Recovered"
                            active={jamaicaCasesType === "recovered"}
                            cases={prettyPrint(recoveredStats(parish))}/>

                        <InfoBox
                            onClick={(e) => setJamaicaCasesType("deaths")}
                            title="Deaths"
                            isBlack
                            active={jamaicaCasesType === "deaths"}
                            cases={prettyPrint(deathStats(parish))}/> 
                    </div>
            

                    <div className ="jamaican__map" >
                        <MapContainer center ={jamaicaMapCenter} zoom={jamaicaMapZoom} scrollWheelZoom={false} >
                            <ChangeView jamaicaCenter={jamaicaMapCenter} jamaicaZoom={jamaicaMapZoom}/>
                    
                            <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {parish !== "worldwide" ?(
                                <Circle
                                pathOptions={{color: caseTypeColour[jamaicaCasesType].hex, fillColor: caseTypeColour[jamaicaCasesType].hex}}
                                center={[infoOnParishes[parish].lat, infoOnParishes[parish].lon]}
                                fillOpacity={0.4}
                                radius= {Math.sqrt(infoOnParishes[parish][jamaicaCasesType]) * caseTypeColour[jamaicaCasesType].multiplier} >

                                    <Popup>
                                        <div className="jainfo-container">
                                            <div className="jainfo-name">{parish}</div>
                                            <div className="jainfo-confirmed">Cases: {numeral(infoOnParishes[parish].cases).format("0,0")}</div>
                                            <div className="jainfo-recovered">Recovered: {numeral(infoOnParishes[parish].recovered).format("0,0")}</div>
                                            <div className="jainfo-deaths">Deaths: {numeral(infoOnParishes[parish].deaths).format("0,0")}</div>
                                            
                                        </div>
                                    </Popup>
                                </Circle>
                                ) : (
                            parishes.map((par) =>(
                        
                                <Circle
                                pathOptions={{color: caseTypeColour[jamaicaCasesType].hex, fillColor: caseTypeColour[jamaicaCasesType].hex}}
                                center={[infoOnParishes[par].lat, infoOnParishes[par].lon]}
                                fillOpacity={0.4}
                                radius= {Math.sqrt(infoOnParishes[par][jamaicaCasesType]) * caseTypeColour[jamaicaCasesType].multiplier}> 
                                
                                    <Popup>
                                        <div className="jainfo-container">
                                            <div className="jainfo-name">{par}</div>
                                            <div className="jainfo-confirmed">Cases: {numeral(infoOnParishes[par].cases).format("0,0")}</div>
                                            <div className="jainfo-recovered">Recovered: {numeral(infoOnParishes[par].recovered).format("0,0")}</div>
                                            <div className="jainfo-deaths">Deaths: {numeral(infoOnParishes[par].deaths).format("0,0")}</div>
                                            
                                        </div>
                                    </Popup>
                                
                                </Circle> )))}
              

                        </MapContainer>

                    </div>

            </div>

            <Card className = "japp__right">
                <CardContent>
                    <h3>Live Cases by Parishes</h3>

                    <JamaicanTable
                    parishes ={parishes} /> 
                </CardContent>

            </Card>
            
        </div>
    );
}

export default JamaicanMap;



