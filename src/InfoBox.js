import { Card, CardContent, Typography} from "@material-ui/core";
import React from "react";
import "./InfoBox.css";

function InfoBox({ title, cases, isRed, isBlack, active, total, ...props }) {
    console.log(title, active);
    
    return (
        <Card 
            onClick ={props.onClick} 
            className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"} ${isBlack && "infoBox--black"}`}>
            <CardContent>
               
                <Typography className="infoBox__title" color="textSecondary" gutterBottom>
                    {title}
                </Typography>

                <h2 className={`infoBox__cases ${!(isRed || isBlack)  && "infoBox__cases--green"}`}>{cases}</h2>
                
                <Typography className ="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
                
            </CardContent>
            
        </Card>
    );
}

export default InfoBox
