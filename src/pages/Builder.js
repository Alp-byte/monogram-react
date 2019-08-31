import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionCreators } from 'redux-undo';
import BuilderCanvas from '../components/BuilderCanvas';

import BuildInstructions from '../components/BuildInstructions';
import BuilderSidebar from '../components/BuilderSidebar';

import LayersSidebar from '../components/LayersSidebar';

import BottomPopup from '../components/BottomPopup';

import { resetGallery } from '../redux/gallery/actions';

import {
  setFont,
  setDefaultFont,
  setText,
  setFrame,
  setSize,
  setColor,
  setDefaultPosition,
  setPosition,
  setActive,
  removeActive,
  removeAllActive,
  setAngle,
  changeLayerOrder,
  createLayer,
  renamelayer,
  changeDisableEdit,
  onLayerDelete,
  updateLayer,
  updateLayers,
  deleteUploadFile,
  saveUploadedFiles,
  setBackground,
  copyLayer,
  pasteLayer,
  duplicateLayer,
  resetShapeStyle,
  deleteBuilderDownloadData,
  saveBuilderDownloadData
} from '../redux/builder';

class Builder extends Component {
  componentDidMount() {
    if (this.props.userMonograms.length || this.props.monograms.length) {
      this.props.resetGallery();
    }

    window.addEventListener('beforeunload', this.blockRefresh);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.blockRefresh);
  }
  blockRefresh = e => {
    const { layers } = this.props;

    if (layers && layers.length) {
      e.preventDefault();

      e.returnValue = '';
    }
  };
  renderMobile = () => {
    const {
      layers,
      defaultFont,
      prevFrameRect,
      hasFuture,
      hasPast,
      activeSelector,
      setActiveSelector,
      setFrame,
      frame_list,
      font_list,
      createLayer
    } = this.props;
    const activeLayers = layers.filter(el => el.active);
    return (
      <React.Fragment>
        <BuilderCanvas
          isMobile
          duplicateLayer={this.props.duplicateLayer}
          deleteBuilderDownloadData={this.props.deleteBuilderDownloadData}
          builderDownloadData={this.props.builderDownloadData}
          saveBuilderDownloadData={this.props.saveBuilderDownloadData}
          setDefaultPosition={this.props.setDefaultPosition}
          onSetColor={this.props.setColor}
          onSetPosition={this.props.setPosition}
          onSetSize={this.props.setSize}
          onSetActive={this.props.setActive}
          onRemoveAllActive={this.props.removeAllActive}
          onRemoveActive={this.props.removeActive}
          onLayerDelete={this.props.onLayerDelete}
          onChangeLayerOrder={this.props.changeLayerOrder}
          onSetAngle={this.props.setAngle}
          onCreateLayer={this.props.createLayer}
          onChangeDisableEdit={this.props.changeDisableEdit}
          layers={layers}
          prevFrameRect={prevFrameRect}
          activeLayer={activeLayers[0] || {}}
          activeLayers={activeLayers}
          updateLayer={this.props.updateLayer}
          updateLayers={this.props.updateLayers}
          undo={this.props.undo}
          redo={this.props.redo}
          hasFuture={hasFuture}
          hasPast={hasPast}
          setActiveSelector={setActiveSelector}
          activeSelector={activeSelector}
        />
        <BottomPopup
          activeLayers={activeLayers}
          onFrameSelect={setFrame}
          onCreateLayer={createLayer}
          layers={layers}
          onSetActive={this.props.setActive}
          onDeleteUploadFile={this.props.deleteUploadFile}
          onSetBackground={this.props.setBackground}
          uploadedFiles={this.props.uploadedFiles}
          onSaveUploadedFiles={this.props.saveUploadedFiles}
          defaultFont={defaultFont}
          onFontSelect={this.props.setFont}
          onSetText={this.props.setText}
          onSetDefaultFont={this.props.setDefaultFont}
          setActiveSelector={setActiveSelector}
          activeSelector={activeSelector}
          frame_list={frame_list}
          font_list={font_list}
        />
      </React.Fragment>
    );
  };
  renderDesktop = () => {
    const {
      layers,
      defaultFont,
      prevFrameRect,
      hasFuture,
      hasPast,
      builderLoadedMonogram,
      frame_list,
      font_list
    } = this.props;
    const activeLayers = layers.filter(el => el.active);
    return (
      <div className="app-content">
        <BuildInstructions />
        <div className="builder-section">
          <BuilderSidebar
            onDeleteUploadFile={this.props.deleteUploadFile}
            onSetBackground={this.props.setBackground}
            onCreateLayer={this.props.createLayer}
            uploadedFiles={this.props.uploadedFiles}
            onSaveUploadedFiles={this.props.saveUploadedFiles}
            layers={layers}
            defaultFont={defaultFont}
            activeLayers={activeLayers}
            onFontSelect={this.props.setFont}
            onFrameSelect={this.props.setFrame}
            onSetText={this.props.setText}
            onSetDefaultFont={this.props.setDefaultFont}
            frame_list={frame_list}
            font_list={font_list}
          />

          <BuilderCanvas
            builderLoadedMonogram={builderLoadedMonogram}
            deleteBuilderDownloadData={this.props.deleteBuilderDownloadData}
            builderDownloadData={this.props.builderDownloadData}
            copyLayer={this.props.copyLayer}
            duplicateLayer={this.props.duplicateLayer}
            resetShapeStyle={this.props.resetShapeStyle}
            pasteLayer={this.props.pasteLayer}
            copiedlayers={this.props.copiedlayers}
            saveBuilderDownloadData={this.props.saveBuilderDownloadData}
            setDefaultPosition={this.props.setDefaultPosition}
            onSetColor={this.props.setColor}
            onSetPosition={this.props.setPosition}
            onSetSize={this.props.setSize}
            onSetActive={this.props.setActive}
            onRemoveAllActive={this.props.removeAllActive}
            onRemoveActive={this.props.removeActive}
            onLayerDelete={this.props.onLayerDelete}
            onChangeLayerOrder={this.props.changeLayerOrder}
            onSetAngle={this.props.setAngle}
            onCreateLayer={this.props.createLayer}
            onChangeDisableEdit={this.props.changeDisableEdit}
            layers={layers}
            prevFrameRect={prevFrameRect}
            onRenameLayer={this.props.renamelayer}
            activeLayer={activeLayers[0] || {}}
            activeLayers={activeLayers}
            updateLayer={this.props.updateLayer}
            updateLayers={this.props.updateLayers}
            undo={this.props.undo}
            redo={this.props.redo}
            hasFuture={hasFuture}
            hasPast={hasPast}
          />
        </div>
      </div>
    );
  };
  render() {
    const { isMobile } = this.props;

    return isMobile ? this.renderMobile() : this.renderDesktop();
  }
}

const mapStateToProps = state => {
  return {
    layers: state.builder.present.layers,
    copiedlayers: state.builder.present.copiedlayers,
    builderDownloadData: state.builder.present.builderDownloadData,
    defaultFont: state.builder.present.defaultFont,
    uploadedFiles: state.builder.present.uploadedFiles,
    prevFrameRect: state.builder.present.prevFrameRect,
    hasFuture: state.builder.future && state.builder.future.length > 0,
    hasPast: state.builder.past && state.builder.past.length > 0,
    userMonograms: state.gallery.userMonograms,
    monograms: state.gallery.monograms,
    builderLoadedMonogram: state.gallery.builderLoadedMonogram,
    font_list: state.auth.font_list,
    frame_list: state.auth.frame_list
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFont,
      setDefaultFont,
      copyLayer,
      duplicateLayer,
      resetShapeStyle,
      pasteLayer,
      setText,
      setFrame,
      setSize,
      setColor,
      setDefaultPosition,
      setPosition,
      setActive,
      removeAllActive,
      removeActive,
      onLayerDelete,
      setAngle,
      renamelayer,
      changeDisableEdit,
      changeLayerOrder,
      createLayer,
      updateLayer,
      updateLayers,
      saveUploadedFiles,
      saveBuilderDownloadData,
      deleteUploadFile,
      setBackground,
      deleteBuilderDownloadData,
      undo: ActionCreators.undo,
      redo: ActionCreators.redo,
      resetGallery
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Builder);
