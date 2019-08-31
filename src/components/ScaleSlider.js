import React, { Component } from 'react';
import { getCenter, getPoint } from '../utils/free-transform';
import Slider from './Slider';
export default class ScaleSlider extends Component {
  constructor(props) {
    super();
    this.calculatePoint = true;
    this.scaleX = props.activeLayer.scaleX || 1;
    this.scaleY = props.activeLayer.scaleY || 1;
    this.position = { ...props.activeLayer.position } || {};
    this.data = {};
  }
  componentWillReceiveProps(nextProps) {
    this.scaleX = nextProps.activeLayer.scaleX || 1;
    this.scaleY = nextProps.activeLayer.scaleY || 1;
    this.position = { ...nextProps.activeLayer.position } || {};
  }

  render() {
    const {
      activeLayer,
      updateTransform,
      onSetSize,
      isMobile,
      domRef
    } = this.props;

    const { angle, id, scaleX, scaleY, target, width, height } = activeLayer;

    if (this.calculatePoint) {
      this.point = getPoint('nvm', {
        x: this.position ? this.position.x : 0,
        y: this.position ? this.position.y : 0,
        scaleX,
        scaleY,
        width,
        height,
        angle,
        scaleFromCenter: true
      });
    }

    return (
      <Slider
        value={((this.scaleX + this.scaleY) / 2) * 100 || 100}
        onChange={value => {
          this.calculatePoint = false;
          const diff = value / 100 - (this.scaleX + this.scaleY) / 2;

          this.scaleX = this.scaleX + parseFloat(diff.toFixed(2));
          this.scaleY = this.scaleY + parseFloat(diff.toFixed(2));

          if (
            Number(diff.toFixed(2)) !== 0 &&
            this.scaleX >= 0.4 &&
            this.scaleY >= 0.4
          ) {
            const center = getCenter({
              x: this.position ? this.position.x : 0,
              y: this.position ? this.position.y : 0,
              width,
              height,
              scaleX: this.scaleX,
              scaleY: this.scaleY
            });

            this.position.x = this.position.x + (this.point.x - center.x);
            this.position.y = this.position.y + (this.point.y - center.y);

            updateTransform(
              id,
              {
                scaleX: this.scaleX,
                scaleY: this.scaleY,
                x: this.position.x,
                y: this.position.y
              },
              target === 'frame' ? 'frameSvgEl' : 'textSvgEl'
            );
          }
        }}
        onUpdate={value => {
          if (domRef && domRef.style) {
            domRef.style.opacity = 1;
          }
          if (value !== Math.round(((scaleX + scaleY) / 2) * 100)) {
            onSetSize(activeLayer.id, {
              scaleX: this.scaleX,
              scaleY: this.scaleY,
              position: this.position
            });
          }
          this.calculatePoint = true;
        }}
        fromScale
        maxValue={isMobile ? 600 : 1500}
        minValue={40}
        isMobile={isMobile}
      />
    );
  }
}
