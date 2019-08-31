import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LazyLoad from 'react-lazyload';

import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

export default class FramesList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      frames: props.frame_list,
      expanded: false,
      offset: 10
    };
    this.expandRef = null;
  }
  static propTypes = {
    onFrameSelect: PropTypes.func.isRequired,
    selectedFrameId: PropTypes.any
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.expanded && this.state.expanded !== prevState.expanded) {
      this.expandRef.scrollTop = this.expandRef.scrollTop + 1;
      this.setState({
        offset: 430
      });
    }
    if (
      prevProps.frame_list.length !== this.props.frame_list.length &&
      !!this.props.frame_list.length
    ) {
      this.setState({
        frames: this.props.frame_list
      });
    }
  }

  frameSelect = frameOriginal => {
    const {
      onCreateLayer,
      onFrameSelect,
      activeLayer,
      setActiveSelector,
      isMobile
    } = this.props;
    // const findFrame = layers.find(
    //   layer => layer.target === 'frame' && !layer.isBackground
    // );
    const frame = {
      ...frameOriginal,
      jpgUrl: undefined
    };
    if (activeLayer.target === 'temp' && isMobile) {
      setActiveSelector(null);
    }
    if (
      activeLayer.target === 'temp' ||
      (activeLayer.target === 'frame' && !activeLayer.isBackground)
    ) {
      const prevFrameRect = document.getElementById(
        `frameSvg_${activeLayer.id}`
      );

      return onFrameSelect(activeLayer.id, frame, {
        prevFrameRect: prevFrameRect
          ? prevFrameRect.getBoundingClientRect()
          : {},
        transform: prevFrameRect ? prevFrameRect.style.transform : ''
      });
    }
    if (
      activeLayer.target !== 'frame' ||
      (activeLayer.target === 'frame' && activeLayer.isBackground)
    ) {
      const template = {
        target: 'frame',
        color: { r: 10, g: 20, b: 30, a: 1 },
        width: 250,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        frame,
        angle: 0,
        name: 'Frame',
        active: true
      };
      onCreateLayer(template);
      if (isMobile) {
        setActiveSelector(null);
      }
    }
  };

  handleArrow = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded
    }));
  };

  LoadError = id => {
    const newFrames = [...this.state.frames];
    newFrames[id] = {
      ...newFrames[id],
      error: true
    };
    this.setState({
      frames: newFrames
    });
  };

  render() {
    const {
      selectedFrameId,

      blurAll,
      isMobile
    } = this.props;
    //  const findFrame = layers.find(layer => layer.target === 'frame');
    let withBlur = false;
    // findFrame &&
    // activeLayer.target &&
    // activeLayer.target !== 'frame' &&
    // activeLayer.target !== 'temp';

    return (
      <div
        className={classNames({
          'frame-list-mobile': isMobile,
          'sidebar-section': !isMobile,
          'expanded-open': !isMobile && this.state.expanded,
          'expanded-close': !isMobile && !this.state.expanded
        })}
      >
        {(withBlur || blurAll) && (
          <div id="overlay">{withBlur && 'Select Frame To Edit'}</div>
        )}
        <div className="sidebar-section-content">
          <div className="sidebar-section-content__title sidebar-section-content__title__yellow">
            Select a Frame{' '}
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
            className="sidebar__list"
            style={{
              overflow: 'auto'
            }}
          >
            {this.state.frames.map(frame => {
              const itemClassName = classNames({
                sidebar__list__item: true,
                sidebar__list__item_selected: frame.name === selectedFrameId
              });
              
              return (
                <div
                  key={frame.name}
                  className={itemClassName}
                  style={{
                    position: 'relative'
                  }}
                  onDragStart={e => {
                    e.dataTransfer.setData('shape', JSON.stringify(frame));
                  }}
                  draggable
                  onClick={frame.error ? null : () => this.frameSelect(frame)}
                >
                  <LazyLoad throttle={200} offset={this.state.offset} overflow>
                    <img
                      className="frame-preview"
                      // onError={() => this.LoadError(frame.id - 1)}
                      src={require(`../assets/frames/preview/${
                        frame.name
                      }.jpeg`)}
                      alt="Frame"
                      style={{
                        transform: isMobile ? 'none' : ' translateY(-50%)'
                      }}
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
