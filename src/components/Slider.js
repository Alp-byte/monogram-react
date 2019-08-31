import React, { Component } from 'react';
import { Slider, Rail, Handles } from 'react-compound-slider';

import { SliderRail, Handle } from './sliderComponents'; // example render components - source below

const sliderStyle = {
  position: 'relative',
  width: '100%'
};

class _Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultValue: props.value
    };
  }
  componentWillMount = props => {
    this.clickTimeout = null;
  };
  handleClicks = () => {
    if (this.clickTimeout !== null) {
      this.props.onUpdate(this.state.defaultValue);
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    } else {
      this.clickTimeout = setTimeout(() => {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
      }, 200);
    }
  };
  render() {
    const {
      props: { value, onChange, onUpdate, label, maxValue, minValue, isMobile }
    } = this;

    return (
      <div className="font-size-slider">
        {label && (
          <span
            style={{
              color: 'grey',
              fontSize: '14px',
              width: '68px',
              marginRight: 14
            }}
          >
            {label}
          </span>
        )}

        <Slider
          mode={1}
          step={1}
          domain={[minValue, maxValue]}
          rootStyle={sliderStyle}
          onUpdate={values => {
            onChange(values[0]);
          }}
          onChange={values => {
            onUpdate(values[0]);
          }}
          values={[value]}
        >
          <Rail>
            {({ getRailProps }) => (
              <SliderRail getRailProps={getRailProps} isMobile={isMobile} />
            )}
          </Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles" onClick={this.handleClicks}>
                {handles.map(handle => (
                  <Handle
                    key={handle.id}
                    handle={handle}
                    domain={[minValue, value]}
                    getHandleProps={getHandleProps}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </Handles>
        </Slider>
      </div>
    );
  }
}

export default _Slider;
