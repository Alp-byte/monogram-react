import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

const arrowRenderer = () => (
  <i className="fa fa-angle-down" style={{ color: 'grey' }} />
);

const SelectControl = props => (
  <Select {...props} arrowRenderer={arrowRenderer} />
);

SelectControl.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string
    })
  ).isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  clearable: PropTypes.bool.isRequired
};

export default SelectControl;
