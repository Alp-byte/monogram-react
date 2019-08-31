import React, { Component } from 'react';
import ColorPicker from './ColorPicker';
import ScaleSlider from './ScaleSlider';
import RotateSlider from './RotateSlider';
import {
  FaArrowsAlt,
  FaSync,
  FaExpandArrowsAlt,
  FaFillDrip
} from 'react-icons/fa';

export default class BuilderControls extends Component {
  componentWillReceiveProps(nextProps) {
    const domString =
      nextProps.activeLayer.target === 'frame'
        ? `#frameSvg_${nextProps.activeLayer.id} svg`
        : `#textSvg_${nextProps.activeLayer.id}`;
    this.domEl = document.querySelector(domString);
  }

  render() {
    const {
      activeLayer,
      handleColorChange,
      blurAll,
      layers,
      onSetSize,
      updateTransform,
      onSetAngle,
      domRef
    } = this.props;
    let withBlur =
      !layers.length || !activeLayer.target || activeLayer.target === 'temp';

    const { color, id, isBackground } = activeLayer;

    return (
      <div className="builder-controls-wrapper">
        {(withBlur || blurAll) && (
          <div id="overlay">
            {(!layers.length ||
              (activeLayer.target && activeLayer.target === 'temp')) &&
              'Type Text Or Select Frame'}{' '}
            {!activeLayer.target && layers.length > 0 && 'Select Layer To Edit'}
          </div>
        )}

        <div className="builder-controls">
          <div className="card-border card-border__blue">3</div>
          <div className="builder-controls--content">
            <div className="builder-controls--content__item">
              <div className="control-title">
                <FaFillDrip className="control-title__icon" />
                Color
              </div>
              <div className="control-content">
                <ColorPicker
                  activeLayer={activeLayer}
                  value={
                    color || {
                      r: 0,
                      g: 0,
                      b: 0,
                      a: 0
                    }
                  }
                  isBackground={isBackground}
                  onSetColor={color => handleColorChange(color.rgb, id)}
                />
              </div>
            </div>
            <div className="builder-controls--content__item">
              <div className="control-title">
                <FaExpandArrowsAlt className="control-title__icon" />
                Scale
              </div>
              <div
                className="control-content"
                style={{
                  width: '100%'
                }}
              >
                <ScaleSlider
                  activeLayer={activeLayer}
                  updateTransform={updateTransform}
                  onSetSize={onSetSize}
                  domRef={domRef}
                />
              </div>
            </div>
            <div className="builder-controls--content__item">
              <div className="control-title">
                <FaSync className="control-title__icon" />
                Rotation
              </div>
              <div
                className="control-content"
                style={{
                  width: '100%'
                }}
              >
                <RotateSlider
                  onSetAngle={onSetAngle}
                  activeLayer={activeLayer}
                  updateTransform={updateTransform}
                  domRef={domRef}
                />
              </div>
            </div>
            <div className="builder-controls--content__item">
              <div className="control-title">
                <FaArrowsAlt className="control-title__icon" />
                Position
              </div>
              <div className="control-content">
                Click and drag the items on the canvas to move them
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
