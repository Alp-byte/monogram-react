import React from 'react';
import PropTypes from 'prop-types';
const Rotator = ({ onMouseDown, onTouchStart }) => (
  <div
    className="tr-transform__rotator"
    onMouseDown={onMouseDown}
    onTouchStart={onTouchStart}
  />
);

Rotator.propTypes = {
  onMouseDown: PropTypes.func.isRequired
};

export default Rotator;
