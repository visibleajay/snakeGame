
import React from 'react';

import PropTypes from 'prop-types';

import "./Point.css";

function Point({xPos, yPos}) {
    return (
        <div className="Point" style={{"top": yPos, "left": xPos}}>
        </div>
    );
}

Point.propTypes = {
    xPos: PropTypes.number.isRequired,
    yPos: PropTypes.number.isRequired
}

export default Point;

