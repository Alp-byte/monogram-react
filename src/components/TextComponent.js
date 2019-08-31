import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { MIRRORED_FONTS_IDS } from '../constants';
import { dualMirrorText } from '../utils';

export default class TextSvg extends PureComponent {
  static propTypes = {
    selectedFont: PropTypes.any,
    size: PropTypes.number,
    color: PropTypes.object,
    value: PropTypes.string,
    angle: PropTypes.number,
    id: PropTypes.number
  };
  componentDidMount() {
    const { id } = this.props;
    const svg = document.getElementById(`textSvg_${id}`);

    if (svg) {
      const box = svg.getBBox();
      const viewBox = [box.x, box.y, box.width, box.height].join(' ');
      svg.setAttribute('viewBox', viewBox);
      svg.setAttribute('width', box.width);
    }
  }
  componentDidUpdate() {
    const { id } = this.props;
    const svg = document.getElementById(`textSvg_${id}`);

    if (svg) {
      const box = svg.getBBox();
      const viewBox = [box.x, box.y, box.width, box.height].join(' ');
      svg.setAttribute('viewBox', viewBox);
      svg.setAttribute('width', box.width);
    }
  }

  renderText = () => {
    const { selectedFont, size, color, value, id } = this.props;
    if (!value) {
      return null;
    }

    const fontColorValue = `rgb(${color.r}, ${color.g}, ${color.b})`;
    const opacity = color.a;

    let processedText = MIRRORED_FONTS_IDS.includes(selectedFont.font_id)
      ? dualMirrorText(value)
      : value;

    if (!selectedFont.isLowerCase) {
      processedText = processedText.toUpperCase();
    }
    if (!selectedFont.isUpperCase) {
      processedText = processedText.toLowerCase();
    }

    const textPathData = selectedFont.loadedSVGFont
      .getPath(processedText, 0, 0, size)
      .toPathData();

    return (
      <svg id={`textSvg_${id}`} opacity={opacity} fill={fontColorValue}>
        <path
          id="textPath"
          d={textPathData}
          style={{
            pointerEvents: 'bounding-box',
            cursor: 'move'
          }}
        />
      </svg>
    );
  };

  render() {
    const { selectedFont } = this.props;
    if (!selectedFont || !selectedFont.loadedSVGFont) {
      return null;
    }
    return this.renderText();
  }
}
