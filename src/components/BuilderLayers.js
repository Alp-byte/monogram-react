import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ContextMenuTrigger } from 'react-contextmenu';
import ContentEditable from 'react-contenteditable';
import classNames from 'classnames';
import ContextMenu from '../components/ContextMenu';
import ClickOutside from '../HOC/ClickOutside';
import { MdFilterFrames, MdImage, MdTextFormat } from 'react-icons/md';
import { FiTrash2 } from 'react-icons/fi';
import { FaPencilAlt, FaTimes, FaEllipsisV, FaAngleDown } from 'react-icons/fa';

export default class LayerControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      expanded: false
    };
    this.contentEditable = {};
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  focusInput = async layer => {
    await this.props.onChangeDisableEdit(false, layer && layer.id);
    const domNODE = this.contentEditable[layer.id].getEl();
    domNODE.focus();
    const range = document.createRange();
    const sel = window.getSelection();
    range.setStart(domNODE, layer.name ? 1 : 0);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  };

  renderSelect = () => {
    if (this.props.showSelect) {
      return (
        <section className="create_layer_select">
          <ul>
            <li
              className="font-list"
              onClick={() => {
                this.props.selectLayer('text');
              }}
            >
              <MdTextFormat className="topbar-icon topbar-icon__font" />
              <p>Text</p>
            </li>
            <li
              className="frame-list"
              onClick={() => {
                this.props.selectLayer('frame');
              }}
            >
              <MdFilterFrames className="topbar-icon topbar-icon__frame" />
              <p>Frame</p>
            </li>
            <li
              className="bg-list"
              onClick={() => {
                this.props.selectLayer('background');
              }}
            >
              <MdImage className="topbar-icon topbar-icon__background" />
              <p>Background</p>
            </li>
          </ul>
        </section>
      );
    }
  };

  handleKeyDown = (e, id) => {
    if (e.key === 13 || e.which === 13) {
      this.props.onChangeDisableEdit(true, id);
    }
  };
  onDragEnd(result) {
    const { handleLayerOrderChange } = this.props;
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    handleLayerOrderChange(
      this.props.layers,
      result.source.index,
      result.destination.index
    );
  }

  renderLayerItem = (layer, index) => {
    const { handleLayerClick, handleLayerDelete, onRemoveActive } = this.props;

    return (
      <Draggable key={layer.id} draggableId={layer.id} index={index}>
        {(provided, snapshot) => (
          <div
            onClick={e => {
              const allowMultiple =
                (e.metaKey ||
                  e.ctrlKey ||
                  e.keyCode === 91 ||
                  e.keyCode === 224) &&
                layer.target !== 'temp';

              if (!layer.active) {
                handleLayerClick(layer.id, allowMultiple);
              }

              if (layer.active) {
                onRemoveActive(layer.id);
              }
            }}
            className={`builder-layer-select__actions--item ${
              layer.active ? 'active' : ''
            } ${this.props.isMobile ? 'mobile' : ''}`}
            key={index}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className={`builder-layer-select__actions--item--title ${
                this.props.isMobile ? 'mobile' : ''
              }`}
            >
              <div
                className="delete-layer"
                onClick={() => {
                  handleLayerDelete(layer.id);
                }}
              >
                <FaTimes className="desktop-icon" />
              </div>

              <div
                style={{
                  display: 'flex'
                }}
              >
                {layer.target === 'text' && (
                  <MdTextFormat className="desktop-icon" />
                )}
                {layer.target === 'frame' && !layer.isBackground && (
                  <MdFilterFrames className="desktop-icon" />
                )}

                {layer.target === 'frame' && layer.isBackground && (
                  <MdImage className="desktop-icon" />
                )}
              </div>
              <ContentEditable
                html={layer.name}
                onKeyDown={e => this.handleKeyDown(e, layer.id)}
                className={`builder-layer-select__actions--item--title--value`}
                ref={c => (this.contentEditable[layer.id] = c)}
                disabled={layer.disableEdit}
                onChange={e => this.handleChange(e, layer.id)}
              />
            </div>

            <div className="drag-order" {...provided.dragHandleProps}>
              <FaEllipsisV className="drag-order-icon" />
              <FaEllipsisV className="drag-order-icon" />
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  renderLayerItemMobile = (layer, index) => {
    const {
      handleLayerClick,
      handleLayerDelete,
      onRemoveActive,
      isMobile
    } = this.props;

    return (
      <Draggable
        key={layer.id}
        draggableId={layer.id}
        index={index}
        shouldRespectForcePress
      >
        {(provided, snapshot) => (
          <div
            {...provided.dragHandleProps}
            onClick={e => {
              const allowMultiple =
                (e.metaKey ||
                  e.ctrlKey ||
                  e.keyCode === 91 ||
                  e.keyCode === 224) &&
                layer.target !== 'temp';

              if (!layer.active) {
                handleLayerClick(layer.id, allowMultiple);
              }

              if (
                (e.metaKey ||
                  e.ctrlKey ||
                  e.keyCode === 91 ||
                  e.keyCode === 224) &&
                layer.active
              ) {
                onRemoveActive(layer.id);
              }
            }}
            className={`builder-layer-select__actions--item-mobile ${
              layer.active ? 'active' : ''
            } `}
            key={index}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className={`builder-layer-select__actions--item-mobile--title`}
            >
              <div
                style={{
                  display: 'flex'
                }}
              >
                {layer.target === 'text' && (
                  <MdTextFormat className="topbar-icon topbar-icon__font" />
                )}
                {layer.target === 'frame' && !layer.isBackground && (
                  <MdFilterFrames className="topbar-icon topbar-icon__frame" />
                )}

                {layer.target === 'frame' && layer.isBackground && (
                  <MdImage className="topbar-icon topbar-icon__background" />
                )}
              </div>
              <ContentEditable
                html={layer.name}
                onKeyDown={e => this.handleKeyDown(e, layer.id)}
                className={`builder-layer-select__actions--item-mobile--title--value`}
                ref={c => (this.contentEditable[layer.id] = c)}
                disabled={layer.disableEdit}
                onChange={e => this.handleChange(e, layer.id)}
              />
            </div>
            <div className="layer-item-btns">
              {layer.active && layer.target !== 'temp' && !isMobile && (
                <div
                  className="rename_button"
                  onClick={() => this.focusInput(layer)}
                >
                  <FaPencilAlt className="topbar-icon" />
                </div>
              )}
              <div
                className="delete-layer-mobile"
                onClick={() => {
                  handleLayerDelete(layer.id);
                }}
              >
                <FiTrash2 className="topbar-icon" />
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  expandedlayers = () => {
    this.setState(prevState => {
      return {
        expanded: !prevState.expanded
      };
    });
  };

  handleClickOutside = layer => {
    if (!layer.disableEdit) {
      this.props.onChangeDisableEdit(true, layer.id);
    }
  };

  handleChange = (e, id) => {
    const name = e.target.value;
    this.props.onRenameLayer(name, id);
  };

  renderItem = (layer, index) => {
    if (this.props.isMobile) {
      return this.renderLayerItemMobile(layer, index);
    }
    return (
      <ContextMenuTrigger
        id="contextMenu"
        collect={props => props}
        layer={layer}
      >
        {this.renderLayerItem(layer, index)}
      </ContextMenuTrigger>
    );
  };

  render() {
    const { layers, isMobile } = this.props;
    return (
      <div
        className={classNames({
          'builder-layer-select_mobile': isMobile,
          'builder-layer-select': !isMobile,
          'expanded-layers': !isMobile && this.state.expanded
        })}
      >
        {!isMobile && (
          <div className="builder-layer-select__header">
            <span>Layers</span>
            <FaAngleDown
              onClick={this.expandedlayers}
              style={{
                transition: 'transform 0.2s ease 0s',
                transform: `rotate(${
                  !this.state.expanded ? '0deg' : '180deg'
                })`,
                height: 20,
                width: 20
              }}
            />
          </div>
        )}
        {isMobile && (
          <div
            className="builder-layer-select__create mobile"
            onClick={this.props.showSelectLayer}
          >
            + Add New Layer
          </div>
        )}
        {isMobile && this.renderSelect()}
        <DragDropContext
          onDragEnd={this.onDragEnd}
          className="builder-layer-select__actions"
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {layers.map((layer, index) => (
                  <ClickOutside
                    key={layer.id}
                    onClickOutside={() => this.handleClickOutside(layer)}
                  >
                    {this.renderItem(layer, index)}
                  </ClickOutside>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!isMobile && (
          <div
            className="builder-layer-select__create"
            onClick={() => this.props.createLayer()}
          >
            + Add New Layer
          </div>
        )}

        <ContextMenu
          el={this.contentEditable}
          onChangeDisableEdit={this.props.onChangeDisableEdit}
        />
      </div>
    );
  }
}
