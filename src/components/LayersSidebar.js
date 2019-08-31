import React, { Component } from 'react';
import MobileSidebar from './MobileSidebar';
import BuilderLayers from './BuilderLayers';
import { connect } from 'react-redux';
import { FiLayers } from 'react-icons/fi';

class LayersSidebar extends Component {
  state = {
    showSelect: false
  };
  hideSelectLayer = () => {
    this.setState({ showSelect: false });
  };

  showSelectLayer = () => {
    this.setState(prevState => ({ showSelect: !prevState.showSelect }));
  };
  selectLayer = layer => {
    this.props.onCreateLayer();
    this.props.setActiveSelector(layer);
    this.hideSelectLayer();
  };
  render() {
    return (
      <MobileSidebar
        onStateChange={state => {
          if (!state.isOpen && this.props.activeSelector === 'layers') {
            this.hideSelectLayer();
            this.props.setActiveSelector(null);
          }
        }}
        closeSidebar={() => this.props.setActiveSelector(null)}
        isOpen={this.props.activeSelector === 'layers'}
        right
        title={
          <React.Fragment>
            <span>Layers</span>
            <FiLayers className="topbar-icon" />
          </React.Fragment>
        }
        pageWrapId={'page-wrap'}
        outerContainerId={'outer-container'}
        customCrossIcon={false}
        itemListClassName={'sidebar-layers_content'}
      >
        <BuilderLayers
          isMobile
          showSelect={this.state.showSelect}
          showSelectLayer={this.showSelectLayer}
          selectLayer={this.selectLayer}
          handleLayerClick={this.props.onSetActive}
          onRemoveActive={this.props.onRemoveActive}
          onRenameLayer={this.props.onRenameLayer}
          onChangeDisableEdit={this.props.onChangeDisableEdit}
          handleLayerOrderChange={this.props.onChangeLayerOrder}
          handleLayerDelete={this.props.onLayerDelete}
          layers={this.props.layers}
          createLayer={this.props.onCreateLayer}
        />
      </MobileSidebar>
    );
  }
}
const mapStateToProps = state => ({
  layers: state.builder.present.layers
});

export default connect(mapStateToProps)(LayersSidebar);
