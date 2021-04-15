import React, {useState, useEffect} from "react";
import {Line} from "react-chartjs-2";
import numeral from "numeral";

const options ={
    legend:{
        display: false,
    },
    elements:{
        point:{
            radius:0,
        },
    },

    maintainAspectRatio: false,
    tooltips:{
        mode: "index",
        intersect:false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes: [
            {
                gridLines:{
                    display:false,
                },
                type: "time",
                time:{
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },

            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: true,
            
                },
                ticks:{
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const graphColor = {
    cases:{
        color: "#CC1034",
        fill: "rgb(204, 16, 52, 0.5)"
    },

    recovered:{
        color: "#7dd71d",
        fill:"rgb(125, 215, 29, 0.5)"
    },

    deaths:{
        color: "#000000",
        fill: "rgb(0, 0, 0, 0.5)"
    }
}

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        } 
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({casesType}) {
    const [data, setData] = useState({});
  
 

    useEffect (() => {
        const fetchData = async () => {
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) => response.json())
            .then((data) => {
                let chartData = buildChartData(data, casesType);
                setData(chartData);
                console.log(chartData);
            }); 
        };
        fetchData();
     }, [casesType]);

    return (
        <div >
        
            {data?.length > 0 && (
                <Line

                
                    data = {{
                        datasets: [
                            {
                                backgroundColor: graphColor[casesType].fill,
                                borderColor: graphColor[casesType].color,
                                data: data,
                            },
                        ],
                }}
                options={options}
            />
            )}
           
            
        </div>
    );
}

export default LineGraph
