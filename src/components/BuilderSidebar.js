import React, { PureComponent } from 'react';

import MonogramInput from './MonogramInput';
import FramesList from './FramesList';
import FontsList from './FontsList';
import BackgroundList from './BackgroundList';

export default class BuilderSidebar extends PureComponent {
  render() {
    const {
      activeLayers,
      onFontSelect,
      onFrameSelect,
      defaultFont,
      layers,
      onCreateLayer,
      onSetBackground,
      onSetText,
      onSaveUploadedFiles,
      onDeleteUploadFile,
      uploadedFiles,
      onSetDefaultFont,
      frame_list,
      font_list
    } = this.props;

    const activeLayer = activeLayers[0] || {};

    // const findText = layers.find(layer => layer.target === 'text');
    const blurAll = activeLayers.length > 1;
    let withBlur = false;
    // findText &&
    // activeLayer.target &&
    // activeLayer.target !== 'text' &&
    // activeLayer.target !== 'temp';

    return (
      <div className="sidebar">
        <MonogramInput
          onCreateLayer={onCreateLayer}
          layers={layers}
          onSetText={onSetText}
          activeLayer={activeLayer}
          blurAll={blurAll}
          selectedFont={activeLayer.font || defaultFont}
          withBlur={withBlur}
          defaultFont={defaultFont}
        />
        <div className="sidebar-fontframe-wrapper">
          <div className="card-border card-border__yellow">2</div>
          <div className="sidebar-section-content">
            <FontsList
              selectedFont={activeLayer.font || defaultFont}
              onFontSelect={onFontSelect}
              activeLayer={activeLayer}
              blurAll={blurAll}
              withBlur={withBlur}
              onSetDefaultFont={onSetDefaultFont}
              font_list={font_list}
            />

            <FramesList
              activeLayer={activeLayer}
              blurAll={blurAll}
              onCreateLayer={onCreateLayer}
              layers={layers}
              selectedFrameId={activeLayer.frame && activeLayer.frame.name}
              onFrameSelect={onFrameSelect}
              frame_list={frame_list}
            />
            <BackgroundList
              onSaveUploadedFiles={onSaveUploadedFiles}
              onCreateLayer={onCreateLayer}
              layers={layers}
              onSetBackground={onSetBackground}
              onDeleteUploadFile={onDeleteUploadFile}
              uploadedFiles={uploadedFiles}
              activeLayer={activeLayer}
              blurAll={blurAll}
              withBlur={withBlur}
            />
          </div>
        </div>
      </div>
    );
  }
}
