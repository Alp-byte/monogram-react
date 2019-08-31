import React, { Component } from 'react';
import Rodal from 'rodal';
import Gallery from '../pages/Gallery';
import Badge from '../components/Badge';
import Portal from '../HOC/Portal';

export default class ModalGallery extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: false
    };
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    return (
      <React.Fragment>
        <div onClick={this.handleShow} className="header-item-label">
          Gallery <Badge text="NEW" />
        </div>
        <Portal>
          <Rodal
            visible={this.state.show}
            onClose={this.handleClose}
            customStyles={{
              width: '80%',
              height: '80%'
            }}
            closeMaskOnClick={false}
            className="modal_gallery"
          >
            <div className="modal_gallery-header">
              <span>Gallery</span>
            </div>
            <div className="modal_gallery-body">
              {this.state.show && <Gallery modalClose={this.handleClose} />}
            </div>
          </Rodal>
        </Portal>
      </React.Fragment>
    );
  }
}
