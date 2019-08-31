import React, { Component } from 'react';
import classNames from 'classnames';
import ScaleSlider from './ScaleSlider';
import RotateSlider from './RotateSlider';
import HorizontalAlignment from '../assets/horizontal-alignment.svg';
import VerticalAlignment from '../assets/vertical-alignment.svg';
import Overlap from '../assets/overlap.svg';
import Under from '../assets/under.svg';
import { FaSlidersH } from 'react-icons/fa';
import { IoIosRedo, IoIosUndo } from 'react-icons/io';
import { MdRotate90DegreesCcw, MdPhotoSizeSelectLarge } from 'react-icons/md';
import BuilderDownload from '../modals/BuilderDownloadModal';
import ToolTip from '../HOC/ToolTip';
export default class CanvasToolPanel extends Component {
  state = {
    showSliders: false
  };

  switchPanel = () => {
    this.setState(({ showSliders }) => {
      return {
        showSliders: !showSliders
      };
    });
  };
  increaseOrder = () => {
    const { activeLayer, layers, onChangeLayerOrder } = this.props;

    const activeIndex = layers.findIndex(layer => layer.id === activeLayer.id);
    if (activeIndex !== '-1' && activeIndex !== 0) {
      onChangeLayerOrder(layers, activeIndex, activeIndex - 1);
    }
  };

  decreaseOrder = () => {
    const { activeLayer, layers, onChangeLayerOrder } = this.props;
    const layersCount = layers.length;
    const activeIndex = layers.findIndex(layer => layer.id === activeLayer.id);
    if (activeIndex !== '-1' && activeIndex !== layersCount - 1) {
      onChangeLayerOrder(layers, activeIndex, activeIndex + 1);
    }
  };
  sortHorizontal = () => {
    const { updateLayers, activeLayers } = this.props;
    const canvasDom = document.getElementById('canvas');
    const { width: containerWidth = 0 } = canvasDom
      ? canvasDom.getBoundingClientRect()
      : {};
    const layerstoUpdate = activeLayers.map(activeLayer => {
      const changedWidth = activeLayer.width * (1 - activeLayer.scaleX);
      const newWidth = activeLayer.width - changedWidth;
      const newChangedWidth = newWidth - activeLayer.width;
      const centeredX = containerWidth / 2 - newWidth / 2;
      return {
        id: activeLayer.id,
        position: {
          x: centeredX + newChangedWidth,
          y: activeLayer.position.y
        }
      };
    });
    updateLayers(layerstoUpdate);
  };
  sortVertical = () => {
    const { updateLayers, activeLayers } = this.props;
    const canvasDom = document.getElementById('canvas');
    const { height: containerHeight = 0 } = canvasDom
      ? canvasDom.getBoundingClientRect()
      : {};

    const layerstoUpdate = activeLayers.map(activeLayer => {
      const changedHeight = activeLayer.height * (1 - activeLayer.scaleY);
      const newHeight = activeLayer.height - changedHeight;
      const newChangedHeight = newHeight - activeLayer.height;
      const centeredY = containerHeight / 2 - newHeight / 2;
      return {
        id: activeLayer.id,
        position: {
          x: activeLayer.position.x,
          y: centeredY + newChangedHeight
        }
      };
    });

    updateLayers(layerstoUpdate);
  };
  renderTools = () => {
    const {
      hasPast,
      hasFuture,
      redo,
      undo,
      activeLayer,
      layers,
      blurAll
    } = this.props;
    return (
      <React.Fragment>
        <div className="left-panel-section">
          <div className="undoredo-buttons">
            <IoIosUndo
              className={classNames({
                undo: true,
                disabled: !hasPast
              })}
              onClick={hasPast ? undo : undefined}
            />

            <IoIosRedo
              className={classNames({
                redo: true,
                disabled: !hasFuture
              })}
              onClick={hasFuture ? redo : undefined}
            />
          </div>
          <div className="sort-buttons">
            <img
              className={classNames({
                'sort-buttons_button': true,

                disabled: !activeLayer.target || activeLayer.target === 'temp'
              })}
              src={VerticalAlignment}
              onClick={
                activeLayer.target && activeLayer.target !== 'temp'
                  ? this.sortVertical
                  : undefined
              }
              alt=""
            />
            <img
              className={classNames({
                'sort-buttons_button': true,

                disabled: !activeLayer.target || activeLayer.target === 'temp'
              })}
              src={HorizontalAlignment}
              onClick={
                activeLayer.target && activeLayer.target !== 'temp'
                  ? this.sortHorizontal
                  : undefined
              }
              alt=""
            />
          </div>
          <div className="layer-buttons">
            <img
              className={classNames({
                'layer-buttons_button': true,

                disabled:
                  !activeLayer.target ||
                  layers[0].id === activeLayer.id ||
                  blurAll
              })}
              src={Overlap}
              onClick={
                !activeLayer.target ||
                layers[0].id === activeLayer.id ||
                blurAll
                  ? undefined
                  : this.increaseOrder
              }
              alt=""
            />
            <img
              className={classNames({
                'layer-buttons_button': true,

                disabled:
                  !activeLayer.target ||
                  layers[layers.length - 1].id === activeLayer.id ||
                  blurAll
              })}
              src={Under}
              onClick={
                !activeLayer.target ||
                layers[layers.length - 1].id === activeLayer.id ||
                blurAll
                  ? undefined
                  : this.decreaseOrder
              }
              alt=""
            />
          </div>
        </div>
        <div className="right-panel-section">
          <BuilderDownload
            isMobile
            tags={this.props.tags}
            deleteBuilderDownloadData={this.props.deleteBuilderDownloadData}
            builderDownloadData={this.props.builderDownloadData}
            saveBuilderDownloadData={this.props.saveBuilderDownloadData}
            layers={layers}
            removeActive={this.props.removeActive}
          />
        </div>
      </React.Fragment>
    );
  };

  renderSliders = () => {
    const {
      activeLayer,

      updateTransform,
      onSetSize,
      onSetAngle,
      domRef
    } = this.props;
    return (
      <div
        className={classNames({
          'slider-panel': true
        })}
      >
        <div className="scale-slider">
          <div className="slider-header">
            <MdPhotoSizeSelectLarge />
          </div>
          <ScaleSlider
            activeLayer={activeLayer}
            updateTransform={updateTransform}
            onSetSize={onSetSize}
            domRef={domRef}
            isMobile
          />
        </div>

        <div className="angle-slider">
          <div className="slider-header">
            <MdRotate90DegreesCcw />
          </div>
          <RotateSlider
            onSetAngle={onSetAngle}
            activeLayer={activeLayer}
            updateTransform={updateTransform}
            domRef={domRef}
            isMobile
          />
        </div>
      </div>
    );
  };
  renderMobilePanel = () => {
    const { showSliders } = this.state;
    const { activeLayer } = this.props;
    if ((!activeLayer.target || activeLayer.target === 'temp') && showSliders) {
      this.switchPanel();
    }
    return (
      <div
        className={classNames({
          'top-panel-mobile': true,
          'slider-mode': showSliders
        })}
      >
        <div className="top-section">
          {activeLayer.target && activeLayer.target !== 'temp' && (
            <FaSlidersH
              className={classNames({
                'switch-button': true,
                alt: showSliders
              })}
              onClick={this.switchPanel}
            />
          )}
          {showSliders ? this.renderSliders() : this.renderTools()}
        </div>
      </div>
    );
  };
  renderDesktopPanel = () => {
    const {
      hasPast,
      hasFuture,
      redo,
      undo,
      activeLayer,
      layers,
      blurAll,
      builderLoadedMonogram
    } = this.props;
    return (
      <div
        className={classNames({
          'top-panel': true
        })}
      >
        <div className="undoredo-buttons">
          <ToolTip title="Undo">
            <IoIosUndo
              className={classNames({
                undo: true,
                disabled: !hasPast
              })}
              onClick={hasPast ? undo : undefined}
            />
          </ToolTip>
          <ToolTip title="Redo">
            <IoIosRedo
              className={classNames({
                redo: true,
                disabled: !hasFuture
              })}
              onClick={hasFuture ? redo : undefined}
            />
          </ToolTip>
        </div>
        <div className="middle-group">
          <div className="monogram-title">
            {builderLoadedMonogram
              ? builderLoadedMonogram.title
              : 'New Monogram'}
          </div>
        </div>
        <div className="right-group">
          <div className="layer-buttons">
            <ToolTip title="Send to Front">
              <img
                className={classNames({
                  'layer-buttons_button': true,

                  disabled:
                    !activeLayer.target ||
                    layers[0].id === activeLayer.id ||
                    blurAll
                })}
                src={Overlap}
                onClick={
                  !activeLayer.target ||
                  layers[0].id === activeLayer.id ||
                  blurAll
                    ? undefined
                    : this.increaseOrder
                }
                alt=""
              />
            </ToolTip>
            <ToolTip title="Send Back">
              <img
                className={classNames({
                  'layer-buttons_button': true,

                  disabled:
                    !activeLayer.target ||
                    layers[layers.length - 1].id === activeLayer.id ||
                    blurAll
                })}
                src={Under}
                onClick={
                  !activeLayer.target ||
                  layers[layers.length - 1].id === activeLayer.id ||
                  blurAll
                    ? undefined
                    : this.decreaseOrder
                }
                alt=""
              />
            </ToolTip>
          </div>
          <div className="sort-buttons">
            <ToolTip title="Center Vertically" placement="topLeft">
              <img
                className={classNames({
                  'sort-buttons_button': true,

                  disabled: !activeLayer.target || activeLayer.target === 'temp'
                })}
                src={VerticalAlignment}
                onClick={
                  activeLayer.target && activeLayer.target !== 'temp'
                    ? this.sortVertical
                    : undefined
                }
                alt=""
              />
            </ToolTip>
            <ToolTip title="Center Horizontally" placement="topLeft">
              <img
                className={classNames({
                  'sort-buttons_button': true,

                  disabled: !activeLayer.target || activeLayer.target === 'temp'
                })}
                src={HorizontalAlignment}
                onClick={
                  activeLayer.target && activeLayer.target !== 'temp'
                    ? this.sortHorizontal
                    : undefined
                }
                alt=""
              />
            </ToolTip>
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { isMobile } = this.props;

    return isMobile ? this.renderMobilePanel() : this.renderDesktopPanel();
  }
}
