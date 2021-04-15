import React, {useState} from 'react'
import './JamaicanTable.css'
import numeral from "numeral";
import { infoOnParishes } from './jamaicaninfo';


function JamaicanTable({parishes}) {


    return (
        <div className ="ja__table">
            
            {parishes.map((par) =>(
                <tr>
                    <td>{par}</td>
                    <td>
                        <strong>{numeral(infoOnParishes[par].cases).format("0,0")}</strong>
                    </td>
                </tr>

            ))}
            
        </div>
    )
}

export default JamaicanTable
