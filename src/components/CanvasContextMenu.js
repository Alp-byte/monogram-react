import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { FaPaste } from 'react-icons/fa';

import connectMenu from '../HOC/ConnectContextMenu';

class CanvasContextMenuComponent extends Component {
  render() {
    return (
      <div className='contextMenu'>
        <ContextMenu id='canvasContextMenu'>
          <MenuItem
            attributes={{
              className: `${
                !this.props.copiedlayers.length
                  ? 'disabled-item'
                  : 'no-disabled-item'
              }`
            }}
            disabled={!this.props.copiedlayers.length}
            onClick={this.props.pasteLayer}
          >
            <FaPaste />
            <span className='button-title'>Paste</span>
            <span className='button-info'>(Ctrl + V)</span>
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

export default connectMenu('canvasContextMenu')(CanvasContextMenuComponent);
