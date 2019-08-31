import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MIRRORED_FONTS_IDS } from '../constants';
import classNames from 'classnames';
export class MonogramInput extends Component {
  static propTypes = {
    selectedFont: PropTypes.any
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { defaultFont } = this.props;

    if (
      defaultFont &&
      prevProps.defaultFont &&
      defaultFont !== prevProps.defaultFont
    ) {
      this.inputRef.focus();
    }
  };

  deleteSpecialChars = str => {
    return str.replace(/[^a-zA-Z0-9\s]/gm, '');
  };

  onTextChange = ({ target: { value } }) => {
    const { onCreateLayer, onSetText, selectedFont, activeLayer } = this.props;

    if (!selectedFont) {
      return;
    }

    const text = MIRRORED_FONTS_IDS.includes(selectedFont.font_id)
      ? value.slice(0, 2)
      : value;

    if (
      (activeLayer.target && activeLayer.target === 'temp') ||
      activeLayer.target === 'text'
    ) {
      this.setState({
        visible: false
      });
      return onSetText(activeLayer.id, this.deleteSpecialChars(text));
    }

    if (this.deleteSpecialChars(text).length) {
      const template = {
        target: 'text',
        width: 0,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        font: selectedFont,
        value: this.deleteSpecialChars(text),
        angle: 0,
        name: this.deleteSpecialChars(text),
        active: true
      };

      onCreateLayer(template);
    }
  };

  render() {
    const { isMobile } = this.props;
    return (
      <div
        className={classNames({
          'sidebar-section': !isMobile,
          'sidebar-section__input': !isMobile,
          'input-mobile': isMobile
        })}
      >
        {!isMobile && <div className="card-border card-border__green">1</div>}

        <div className="sidebar-section-content">
          {' '}
          {(this.props.withBlur || this.props.blurAll) && <div id="overlay" />}
          <div className="sidebar-section-content__title sidebar-section-content__title__green">
            Enter your Monogram Letters
          </div>
          <input
            autoCapitalize="off"
            maxLength={15}
            type="text"
            value={this.props.activeLayer.value || ''}
            ref={ins => (this.inputRef = ins)}
            placeholder="i.e. MM"
            className="sidebar-section__input--text-input"
            onChange={this.onTextChange}
          />
        </div>
      </div>
    );
  }
}

export default MonogramInput;
