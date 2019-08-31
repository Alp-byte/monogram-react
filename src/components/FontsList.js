import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LazyLoad from 'react-lazyload';

import Loader from './Loader';
import FontItem from './FontItem';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

export default class FontsList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      fonts: props.font_list,
      expanded: false,
      offset: 10
    };

    this.expandRef = null;
  }

  static propTypes = {
    onFontSelect: PropTypes.func.isRequired,
    selectedFont: PropTypes.object
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.expanded && this.state.expanded !== prevState.expanded) {
      this.expandRef.scrollTop = this.expandRef.scrollTop + 1;
      this.setState({
        offset: 380
      });
    }
    if (
      prevProps.font_list.length !== this.props.font_list.length &&
      this.props.font_list.length
    ) {
      this.setState({
        fonts: this.props.font_list
      });
    }
  }

  handleArrow = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  };

  onFontLoaded = loadedFont => {
    const fontsArr = this.state.fonts.map(font => {
      if (font.font_id === loadedFont.font_id) {
        return loadedFont;
      }
      return font;
    });

    // fontsArr[loadedFont.font_id - 1] = loadedFont;
    this.setState({
      fonts: fontsArr
    });
  };
  render() {
    const {
      selectedFont,
      onFontSelect,
      activeLayer,
      withBlur,
      blurAll,
      onSetDefaultFont,
      isMobile
    } = this.props;
    const { fonts } = this.state;

    return (
      <div
        className={classNames({
          'font-list-mobile': isMobile,
          'sidebar-section__fontlist': !isMobile,
          'sidebar-section': !isMobile,
          'expanded-open': !isMobile && this.state.expanded,
          'expanded-close': !isMobile && !this.state.expanded
        })}
      >
        {(withBlur || blurAll) && (
          <div id="overlay">{withBlur && 'Select Text To Edit'}</div>
        )}
        <div className="sidebar-section-content">
          <div className="sidebar-section-content__title sidebar-section-content__title__yellow">
            Select a Font
            {!isMobile && (
              <div
                className="sidebar-section-content__title sidebar-section-content__title__arrow"
                onClick={this.handleArrow}
              >
                {this.state.expanded ? <FaAngleUp /> : <FaAngleDown />}
              </div>
            )}
          </div>
          <div
            ref={ref => (this.expandRef = ref)}
            className="sidebar__list sidebar__list_fonts"
          >
            {fonts &&
              fonts.map(font => {
                const itemClassName = classNames({
                  sidebar__list__item: true,
                  sidebar__list_fonts__item: true,
                  sidebar__list__item_selected:
                    selectedFont && font.font_id === selectedFont.font_id
                });

                return (
                  <div
                    key={font.font_id}
                    className={itemClassName}
                    onClick={() => {
                      if (font.isLoaded) {
                        if (
                          activeLayer.target &&
                          activeLayer.target !== 'temp' &&
                          activeLayer.target !== 'frame'
                        ) {
                          onFontSelect(font, activeLayer.id);
                        } else {
                          onSetDefaultFont(font);
                        }
                      }
                    }}
                  >
                    <LazyLoad
                      placeholder={
                        <Loader
                          size="mid"
                          style={{
                            fontSize: 6
                          }}
                        />
                      }
                      offset={this.state.offset}
                      throttle={200}
                      overflow
                    >
                      <FontItem
                        font={font}
                        onFontLoaded={this.onFontLoaded}
                        onSetDefaultFont={onSetDefaultFont}
                      />
                    </LazyLoad>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}
