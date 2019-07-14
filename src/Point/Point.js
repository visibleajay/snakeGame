
import React from 'react';
import "./Point.css";

function Point({xPos, yPos}) {
    return (
        <div className="Point" style={{"top": yPos, "left": xPos}}>
        </div>
    );
}

export default Point;

