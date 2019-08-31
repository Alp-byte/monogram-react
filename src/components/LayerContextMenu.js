import React, { Component } from 'react';
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu';
import { FaRegCopy, FaRegTrashAlt, FaRegClone, FaPaste } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';

import connectMenu from '../HOC/ConnectContextMenu';

class LayerContextMenuComponent extends Component {
  render() {
    const propsFromTrigger = this.props.item || {};
    return (
      <div className='contextMenu'>
        <ContextMenu id='layerContextMenu'>
          <MenuItem
            attributes={{
              className: 'no-disabled-item'
            }}
            onClick={() =>
              this.props.copyLayer(
                this.props.activeLayers.length > 1
                  ? this.props.activeLayers
                  : [propsFromTrigger.layer]
              )
            }
          >
            <FaRegCopy />
            <span className='button-title'>Copy</span>
            <span className='button-info'>(Ctrl + C)</span>
          </MenuItem>
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
          <MenuItem
            attributes={{
              className: 'no-disabled-item'
            }}
            onClick={() =>
              this.props.duplicateLayer(
                this.props.activeLayers.length > 1
                  ? this.props.activeLayers
                  : [propsFromTrigger.layer]
              )
            }
          >
            <FaRegClone />
            <span className='button-title'>Duplicate</span>
            <span className='button-info'>(Ctrl + D)</span>
          </MenuItem>
          <SubMenu
            title={
              <span className='button-title'>
                <FiSettings />
                Reset
              </span>
            }
            attributes={{
              className: 'no-disabled-item'
            }}
            selected={false}
          >
            <MenuItem
              onClick={() =>
                this.props.resetShapeStyle({
                  prop: 'scale',
                  activeLayers:
                    this.props.activeLayers.length > 1
                      ? this.props.activeLayers
                      : [propsFromTrigger.layer]
                })
              }
            >
              Reset Scaling
            </MenuItem>
            <MenuItem
              onClick={() =>
                this.props.resetShapeStyle({
                  prop: 'rotate',
                  activeLayers:
                    this.props.activeLayers.length > 1
                      ? this.props.activeLayers
                      : [propsFromTrigger.layer]
                })
              }
            >
              Reset Rotation
            </MenuItem>

            <MenuItem
              onClick={() =>
                this.props.resetShapeStyle({
                  prop: 'all',
                  activeLayers:
                    this.props.activeLayers.length > 1
                      ? this.props.activeLayers
                      : [propsFromTrigger.layer]
                })
              }
            >
              Reset All
            </MenuItem>
          </SubMenu>
          <hr style={{ border: '1px solid #e8e8e8b8' }} />
          <MenuItem
            attributes={{
              className: 'no-disabled-item'
            }}
            onClick={() =>
              this.props.handleLayerDelete(
                propsFromTrigger.layer && propsFromTrigger.layer.id
              )
            }
          >
            <FaRegTrashAlt />
            <span className='button-title'>Delete</span>
          </MenuItem>
        </ContextMenu>
      </div>
    );
  }
}

export default connectMenu('layerContextMenu')(LayerContextMenuComponent);
