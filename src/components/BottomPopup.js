import React, { Component } from 'react';
import FramesList from './FramesList';
import FontsList from './FontsList';
import ClickOutside from '../HOC/ClickOutside';
import BackgroundList from './BackgroundList';
import MonogramInput from './MonogramInput';

export default class BottomPopup extends Component {
  renderActiveSelector = () => {
    const {
      activeSelector,
      activeLayers,
      onFrameSelect,
      defaultFont,
      onFontSelect,
      layers,
      onCreateLayer,
      onSetBackground,
      onSetText,
      onSaveUploadedFiles,
      onDeleteUploadFile,
      uploadedFiles,
      onSetDefaultFont,
      setActiveSelector,
      frame_list,
      font_list
    } = this.props;

    const activeLayer = activeLayers[0] || {};

    // const findText = layers.find(layer => layer.target === 'text');
    const blurAll = activeLayers.length > 1;
    switch (activeSelector) {
      case 'frame':
        return (
          <ClickOutside
            onClickOutside={() => {
              this.props.setActiveSelector(null);
            }}
            style={{
              height: '38%',
              overflow: 'hidden'
            }}
          >
            <FramesList
              activeLayer={activeLayer}
              blurAll={blurAll}
              onCreateLayer={onCreateLayer}
              layers={layers}
              selectedFrameId={activeLayer.frame && activeLayer.frame.name}
              onFrameSelect={onFrameSelect}
              isMobile
              setActiveSelector={setActiveSelector}
              frame_list={frame_list}
            />
          </ClickOutside>
        );

      case 'text':
        return (
          <ClickOutside
            onClickOutside={() => {
              this.props.setActiveSelector(null);
            }}
            style={{
              height: '38%',
              overflow: 'hidden'
            }}
          >
            <div className="input-font-wrapper">
              <MonogramInput
                onCreateLayer={onCreateLayer}
                layers={layers}
                onSetText={onSetText}
                activeLayer={activeLayer}
                blurAll={blurAll}
                selectedFont={activeLayer.font || defaultFont}
                defaultFont={defaultFont}
                isMobile
              />
              <FontsList
                selectedFont={activeLayer.font || defaultFont}
                onFontSelect={onFontSelect}
                activeLayer={activeLayer}
                blurAll={blurAll}
                onSetDefaultFont={onSetDefaultFont}
                isMobile
                font_list={font_list}
              />
            </div>
          </ClickOutside>
        );
      case 'background':
        return (
          <ClickOutside
            onClickOutside={() => {
              this.props.setActiveSelector(null);
            }}
            style={{
              height: '38%',
              overflow: 'hidden'
            }}
          >
            <BackgroundList
              onSaveUploadedFiles={onSaveUploadedFiles}
              onCreateLayer={onCreateLayer}
              layers={layers}
              onSetBackground={onSetBackground}
              onDeleteUploadFile={onDeleteUploadFile}
              uploadedFiles={uploadedFiles}
              activeLayer={activeLayer}
              blurAll={blurAll}
              isMobile
              setActiveSelector={setActiveSelector}
            />
          </ClickOutside>
        );

      default:
        return null;
    }
  };
  render() {
    return this.renderActiveSelector();
  }
}
