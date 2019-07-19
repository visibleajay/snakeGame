
import React from 'react';

import PropTypes from 'prop-types';

import "./Box.css";

function Box({top, left}) {
    return  (
        <div className="Box" style={{'top': top, 'left': left }}></div>
    );
}

Box.propTypes = {
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired
};

export default Box;
