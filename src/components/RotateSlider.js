import React, { Component } from 'react';
import Slider from './Slider';
export default class ScaleSlider extends Component {
  constructor(props) {
    super();

    this.angle = props.activeLayer.angle || 1;
  }
  componentWillReceiveProps(nextProps) {
    this.angle = nextProps.activeLayer.angle || 1;
  }

  render() {
    const {
      activeLayer,
      updateTransform,
      onSetAngle,
      isMobile,
      domRef
    } = this.props;

    const {
      angle,
      id,

      target
    } = activeLayer;

    return (
      <Slider
        isMobile={isMobile}
        value={this.angle || 0}
        onChange={value => {
          this.angle = value;
          updateTransform(
            id,
            { angle: value },
            target === 'frame' ? 'frameSvgEl' : 'textSvgEl'
          );
        }}
        onUpdate={value => {
          if (domRef && domRef.style) {
            domRef.style.opacity = 1;
          }

          if (value !== Math.round(angle)) {
            onSetAngle(value, id);
          }
        }}
        defaultValue={0}
        minValue={isMobile ? -180 : -360}
        maxValue={isMobile ? 180 : 360}
      />
    );
  }
}
