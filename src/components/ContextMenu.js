import React, { Component } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { FaPencilAlt } from 'react-icons/fa';
import connectMenu from '../HOC/ConnectContextMenu';
class ContextMenuComponent extends Component {
  render() {
    const propsFromTrigger = this.props.item || {};
    return (
      <div className="contextMenu">
        <ContextMenu id="contextMenu">
          <MenuItem
            onClick={async () => {
              await this.props.onChangeDisableEdit(
                false,
                propsFromTrigger.layer && propsFromTrigger.layer.id
              );
              const domNODE = this.props.el[propsFromTrigger.layer.id].getEl();
              domNODE.focus();
              const range = document.createRange();
              const sel = window.getSelection();
              range.setStart(domNODE, propsFromTrigger.layer.name ? 1 : 0);
              range.collapse(true);
              sel.removeAllRanges();
              sel.addRange(range);
            }}
          >
            <FaPencilAlt />
            <span className="button-title">Rename Layer</span>
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

export default connectMenu('contextMenu')(ContextMenuComponent);
