import React, {useState, useEffect} from 'react';
import { FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData, prettyPrint} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from "numeral";
import JamaicanMap from "./JamaicanMap";
import JamaicanCard from "./JamaicanCard"

function App() {
 const [countries, setCountries] = useState([]);  
 const [country, setCountry] = useState("worldwide");                           //keeps track of dropdown selection
 const [countryInfo, setCountryInfo] = useState({});

 const [tableData, setTableData] = useState([]);                               //keeps track of country data in table
 const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
 const [mapZoom, setMapZoom] = useState(3);
 const [mapCountries, setMapCountries] = useState([]);
 const [casesType, setCasesType] = useState("cases");


 

 
 //fetch data for worldwide
 useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
 }, []);


 //fetch data for each country
 //Runs an async function that pings off to a server and awaits info fetched
 useEffect(() => {
  const getCountryData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));  
        let sortedData = sortData(data);
        setCountries(countries);
        setMapCountries(data);
        setTableData(sortedData);        
    });
  };
  getCountryData();
 },[]);

 console.log(casesType);

const onCountryChange = async (e) => {
  const countryCode = e.target.value;
  const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
  await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);


      if (countryCode === "worldwide"){
        setMapCenter([34.80746, -40.4796]);
        setMapZoom(3);
      }else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      }
    });

    console.log(`The new coordinates are: lat${mapCenter}`)
};


  return (

    <div className ="app__body">

    <div className="app">
          <div className="app__left">
            <div className ="app__header">
              <h1>COVID-19 TRACKER </h1>

              {/* ceates the dropdown for the countries */}
              <FormControl className="app__dropdown">

                {/* deals with the selection & changing value in the dropdown */}
                <Select 
                variant="outlined" 
                value={country} 
                onChange={onCountryChange}>

                  <MenuItem value="worldwide">Worldwide</MenuItem>

                  {/* loop through all the countries and show a dropdown list of options */}
                  {countries.map((country) => (
                      <MenuItem value ={country.value}>{country.name}</MenuItem>
                    ))}
                  
                </Select>

              </FormControl>
            </div>

            <div className ="app__stats">
              <InfoBox 
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              isRed
              active={casesType === "cases"}
              cases={prettyPrint(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
              />

              <InfoBox 
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                active={casesType === "recovered"}
                cases={prettyPrint(countryInfo.todayRecovered)}
                total={numeral(countryInfo.recovered).format("0.0a")}
          />

              <InfoBox
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              isBlack
              active={casesType === "deaths"}
              cases={prettyPrint(countryInfo.todayDeaths)}
              total={numeral(countryInfo.deaths).format("0.0a")}
              /> 
            </div>

            <Map 
              
              casesType={casesType} 
              countries = {mapCountries} 
              center={mapCenter} 
              zoom={mapZoom}
              /> 

            

          </div>
          
          <Card className = "app__right">
            <CardContent>
              
              <h3>Live Cases by Country</h3>
              <Table countries ={tableData} />
              
            </CardContent>
            
            <div className = "line__right">

              <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
              <LineGraph casesType={casesType} />
            </div>
            

          </Card>

      
        </div> 
      
          <JamaicanMap />
  
    <div className= "get__info">
      <h1>For general information on... </h1>
      <div className = "ja__card">

        <div onClick ={() => window.location.href='https://jamcovid19.moh.gov.jm/about-corona.html'}>
               <JamaicanCard
                src ='/covid-symptoms.jpeg'
                title = 'Symptoms of COVID-19'
                /> 
        </div>

        <div onClick ={() => window.location.href='https://jamcovid19.moh.gov.jm/about-corona.html'}>
            <JamaicanCard
              src ='/elderly-care.jpeg'
              title = 'Older Adults & COVID-19'
            />
        </div>
      </div>

      <div className = "second__cardrow">
        
      <div onClick ={() => window.location.href='https://jamcovid19.moh.gov.jm/how-to-protect.html'}>
               <JamaicanCard
                src ='/wash-hands.jpeg'
                title = 'Protect Yourself from COVID-19'
                /> 
        </div>

        <div onClick ={() => window.location.href='https://jamcovid19.moh.gov.jm/safety-measures.html'}>
            <JamaicanCard
              src ='/quarantine.jpeg'
              title = 'Quarantine'
            /> 
        </div>
      
        

      </div>
       
    </div>     
       
    </div>


  );
};

export default App;
