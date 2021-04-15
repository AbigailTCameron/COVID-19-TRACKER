import React from 'react'
import './JamaicanCard.css'

function JamaicanCard({src, title}) {
    return (
        <div className = "card">
            <img src = {src} alt= ''/>
            <div className = 'card-info'>
                <h2>{title}</h2>
            </div>
            
        </div>
    )
}

export default JamaicanCard
