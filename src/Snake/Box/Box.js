
import React from 'react';
import "./Box.css";

function Box({top, left}) {
    return  (
        <div className="Box" style={{'top': top, 'left': left }}></div>
    );
}

export default Box;
