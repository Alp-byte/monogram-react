import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import ClickOutside from '../HOC/ClickOutside';
import classNames from 'classnames';
export default class ColorPicker extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.isBackground !== this.props.isBackground ||
      nextProps.value !== this.props.value ||
      this.state.isVisible !== nextState.isVisible
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const domString =
      nextProps.activeLayer.target === 'frame'
        ? `#frameSvg_${nextProps.activeLayer.id} svg`
        : `#textSvg_${nextProps.activeLayer.id}`;
    this.domEl = document.querySelector(domString);
  }
  changeColorDom = (color, id) => {
    const { rgb } = color;
    const colorValue = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    if (this.domEl) {
      this.domEl.setAttribute('fill', colorValue);
      this.domEl.setAttribute('opacity', rgb.a);
    }

    document
      .getElementById('color-preview-rect')
      .setAttribute('fill', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);

    var fillSVG = document.querySelectorAll(
      `#frameSvg_${this.props.activeLayer.id} .withFill .st0`
    );

    if (fillSVG) {
      fillSVG.forEach(node => {
        node.style.fill = colorValue;
      });
    }
  };
  onShow = () => {
    this.setState({ isVisible: true });
  };

  onHide = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { onSetColor, value, isBackground, isMobile } = this.props;
    const { isVisible } = this.state;
    const valueColor = !isBackground
      ? `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`
      : 'white';

    return (
      <div
        className={classNames({
          'color-picker': true,
          'color-picker-mobile': isMobile
        })}
        onClick={isBackground ? undefined : this.onShow}
      >
        <div
          className={`color-picker__content ${
            isBackground ? 'color-picker__content_disabled' : ''
          }`}
        >
          <svg
            className="color-picker__content--rect"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              id="color-preview-rect"
              x="0"
              y="0"
              width="30"
              height="30"
              rx="5"
              ry="5"
              fill={valueColor}
            />
            {isBackground && (
              <line
                x1="28"
                y1="2"
                x2="2"
                y2="28"
                style={{
                  stroke: 'rgb(255,0,0)',
                  strokeWidth: 1
                }}
              />
            )}
          </svg>
        </div>
        {isVisible ? (
          <ClickOutside onClickOutside={this.onHide}>
            <ChromePicker
              color={valueColor}
              onChange={this.changeColorDom}
              onChangeComplete={onSetColor}
            />
          </ClickOutside>
        ) : null}
      </div>
    );
  }
}
