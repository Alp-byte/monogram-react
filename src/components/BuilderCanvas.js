import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';

import { FiTrash2 } from 'react-icons/fi';
import { MdMoreVert, MdContentCopy } from 'react-icons/md';
import { styler } from '../utils';

import { rotate, translate } from '../utils/free-transform';

import BuilderControls from './BuilderControls';
import BuilderDownload from '../modals/BuilderDownloadModal';
import BuilderLayers from './BuilderLayers';
import CanvasToolPanel from './CanvasToolPanel';
import EdgePoint from './EdgePoint';
import Rotator from './Rotator';
import ColorPicker from './ColorPicker';
import LayerContextMenu from '../components/LayerContextMenu';
import CanvasContextMenu from '../components/CanvasContextMenu';

import PopConfirm from './PopConfirm';

import TextSvg from './TextComponent';
import Loader from './Loader';

export default class BuilderCanvas extends Component {
  static propTypes = {
    // SHARED
    onSetColor: PropTypes.func.isRequired,
    onSetPosition: PropTypes.func.isRequired,
    onSetSize: PropTypes.func.isRequired,
    onSetActive: PropTypes.func.isRequired,
    onRemoveAllActive: PropTypes.func.isRequired,
    onSetAngle: PropTypes.func.isRequired,
    onChangeLayerOrder: PropTypes.func.isRequired,
    onLayerDelete: PropTypes.func.isRequired,

    // LAYERS ARRAY
    layers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        target: PropTypes.string.isRequired,
        color: PropTypes.shape({
          r: PropTypes.number.isRequired,
          g: PropTypes.number.isRequired,
          b: PropTypes.number.isRequired,
          a: PropTypes.number.isRequired
        }),

        position: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired
        }),
        angle: PropTypes.number,
        active: PropTypes.bool,
        name: PropTypes.string,
        frame: PropTypes.object,
        font: PropTypes.object,
        value: PropTypes.string
      })
    ).isRequired,

    // ACTIVE LAYER OBJECT
    activeLayer: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      keyPress: false,
      keys: [],
      keyPressed: false,
      visible: false,
      expandTools: false
    };

    // { ID 1: {x,y,scaleX, scaleY, angle}, 2:{...},}
    this.layersPositions = {};
    this.matrix = {};
    this.updateMatrix = false;
  }

  componentDidMount() {
    setInterval(this.handleKeyPress, 100);

    let keyDownTimeout;

    const isArrowKey = code => [37, 38, 39, 40].indexOf(code) !== -1;

    document.onkeyup = event => {
      const { keys } = this.state;

      keys['shift'] = event.shiftKey;
      keys['ctrl'] = event.ctrlKey;

      if (
        // event.shiftKey &&
        event.ctrlKey &&
        (event.code === 'V' || event.which === 86)
      ) {
        if (!!this.props.copiedlayers.length) {
          this.props.pasteLayer();
        }
      }

      if (
        !!this.props.activeLayers.length &&
        event.ctrlKey &&
        (event.code === 'C' || event.which === 67)
      ) {
        this.props.copyLayer(this.props.activeLayers);
      }
      if (
        // event.shiftKey &&
        !!this.props.activeLayers.length &&
        event.ctrlKey &&
        (event.code === 'D' || event.which === 68)
      ) {
        this.props.duplicateLayer(this.props.activeLayers);
      }
      if (
        event.keyCode === 'Delete' ||
        event.which === 46 ||
        (event.ctrlKey &&
          (event.keyCode === 'Backspace' || event.which === 8) &&
          this.props.activeLayer.id)
      ) {
        this.props.onLayerDelete(this.props.activeLayer.id);
      }

      if (
        (event.code === 'KeyZ' || event.which === 90) &&
        event.ctrlKey &&
        this.props.hasPast
      ) {
        this.props.undo();
      }

      if (
        (event.code === 'KeyY' || event.which === 89) &&
        event.ctrlKey &&
        this.props.hasFuture
      ) {
        this.props.redo();
      }
      if (!isArrowKey(event.keyCode)) {
        return;
      }

      if (!keys[event.keyCode]) {
        return;
      }

      keys[event.keyCode] = false;

      this.setState({
        moving: false,
        keys,
        keyPressed: false
      });
    };

    document.onkeydown = event => {
      const { keys } = this.state;

      keys['shift'] = event.shiftKey;
      keys['ctrl'] = event.ctrlKey;

      if (keys[event.keyCode]) {
        if (keys[40] || keys[38]) {
          event.preventDefault();
        }
        return;
      }

      if (!isArrowKey(event.keyCode)) {
        return;
      }

      keys[event.keyCode] = true;

      // down or up
      if (keys[40] || keys[38]) {
        event.preventDefault();
      }

      this.setState({
        keys,
        keyPressed: true,
        moving: false
      });

      clearTimeout(keyDownTimeout);

      keyDownTimeout = setTimeout(() => {
        if (this.state.keyPressed) {
          this.setState({ moving: true });
        }
      }, 100);

      this.handleKeyPress(true);
    };

    const canvas = document.getElementById('canvas');
    if (canvas) {
      const defaultFramePosition = {
        x: canvas.clientWidth / 2 - 250 / 2,
        y: canvas.clientHeight / 2 - 250 / 2
      };

      const newTextCoordinates = this.getCenteredTextCoordinates();

      const defaultTextPosition = {
        x: newTextCoordinates.centeredX,
        y: newTextCoordinates.centeredY
      };

      this.props.setDefaultPosition({
        text: defaultTextPosition,
        frame: defaultFramePosition
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeLayers.length > 1) {
      return;
    }

    const {
      value,
      target,
      id,
      font,
      height,
      scaleX,
      angle,
      scaleY,
      isBackground,
      width
    } = this.props.activeLayer;

    const hasLayerChanged = prevProps.activeLayer.id !== id;
    const hasHeightChanged = prevProps.activeLayer.height !== height;

    // ! BACKGROUND & FRAME INITIALIZATION
    if (prevProps.activeLayer.target === 'frame' && !height) {
      this.frame_id = prevProps.activeLayer.frame.name;
    }

    if (
      !this.props.activeLayer.frame ||
      (!prevProps.activeLayer.isBackground &&
        this.props.activeLayer.isBackground)
    ) {
      this.frame_id = undefined;
    }

    if (target === 'frame' && !height && isBackground) {
      const { height } = document
        .getElementById(`background_${id}`)
        .getBoundingClientRect();

      this.props.updateLayer(id, {
        width: this.props.isMobile ? 200 : 400,
        height
      });
    }
    if (
      target === 'frame' &&
      height &&
      !hasLayerChanged &&
      prevProps.activeLayer.frame &&
      !this.frame_id &&
      prevProps.activeLayer.height !== height
    ) {
      this.props.updateLayer(id, {
        position: {
          x: this.builderCanvas.clientWidth / 2 - width / 2,
          y: this.builderCanvas.clientHeight / 2 - height / 2
        }
      });
    }

    // ? Set scale & angle for new frame from prev frame
    if (
      hasLayerChanged &&
      target === 'frame' &&
      !prevProps.activeLayer.scaleX
    ) {
      this.updateMatrix = false;
    }
    if (hasLayerChanged && target === 'frame') {
      this.matrix = {
        scaleX,
        scaleY,
        angle
      };
    }

    if (
      !hasLayerChanged &&
      prevProps.activeLayer.target !== 'text' &&
      target === 'frame' &&
      height === 0
    ) {
      this.updateMatrix = true;
      this.matrix = {
        scaleX: prevProps.activeLayer.scaleX,
        scaleY: prevProps.activeLayer.scaleY,
        angle: prevProps.activeLayer.angle
      };
    }

    if (
      !hasLayerChanged &&
      this.updateMatrix &&
      prevProps.activeLayer.target !== 'text' &&
      target === 'frame' &&
      hasHeightChanged &&
      height > 0
    ) {
      if (
        (this.matrix.scaleX && this.matrix.scaleX !== scaleX) ||
        (this.matrix.scaleY && this.matrix.scaleY !== scaleY) ||
        (this.matrix.angle && this.matrix.angle !== angle)
      ) {
        this.props.updateLayer(this.props.activeLayer.id, {
          scaleX: this.matrix.scaleX,
          scaleY: this.matrix.scaleY,
          angle: this.matrix.angle
        });
      }
    }

    // !===== TEXT INITIALIZATION
    const hasTextChanged = value !== prevProps.activeLayer.value;
    const hasFontChanged = prevProps.activeLayer.font !== font;
    const hasTextCreated = prevProps.layers.some(
      elem => elem.target === 'text' && elem.id === id
    );
    if (
      (!hasLayerChanged || !hasTextCreated) &&
      target === 'text' &&
      (hasTextChanged || hasFontChanged)
    ) {
      this.initText(prevProps);
    }
  }
  // =================== CENTRAL OR HEIGHT INITIALIZATORS ===================

  initText = prevProps => {
    const { position } = this.props.activeLayer;
    const {
      width,
      height,
      containerWidth,
      containerHeight,
      centeredX,
      centeredY
    } = this.getCenteredTextCoordinates();

    const deltaWidth =
      prevProps.activeLayer.target === 'text'
        ? width - prevProps.activeLayer.width
        : 0;
    const deltaHeight =
      prevProps.activeLayer.target === 'text'
        ? height - prevProps.activeLayer.height
        : 0;
    const newFontDragPosition = { ...position };

    if (deltaWidth) {
      const newX = position.x - deltaWidth / 2;
      if (newX < 0) {
        position.x = 0;
      } else if (newX > containerWidth - width) {
        newFontDragPosition.x = containerWidth - width;
      } else {
        newFontDragPosition.x = newX;
      }
    }
    if (deltaHeight) {
      const newY = position.y - deltaHeight / 2;
      if (newY < 0) {
        newFontDragPosition.y = 0;
      } else if (newY > containerHeight - height) {
        newFontDragPosition.y = containerHeight - height;
      } else {
        newFontDragPosition.y = newY;
      }
    }

    const text = this.getCenteredTextCoordinates();

    this.props.updateLayer(this.props.activeLayer.id, {
      width: text.width,
      height: text.height,
      position:
        deltaHeight || deltaWidth
          ? newFontDragPosition
          : {
              x: centeredX,
              y: centeredY
            }
    });
  };
  // =================== HANDLERS =========================

  setPositionById = (id, { x, y }, refString) => {
    this.props.onSetPosition({ x, y }, id);
    this.updateTransform(id, { x, y }, refString, true);
  };

  setActiveById = (id, multiple) => {
    const { onSetActive, isMobile } = this.props;
    if (isMobile) {
      this.setState({
        expandTools: false
      });
    }

    onSetActive(id, multiple);
  };

  // ARROWS CONTROL
  handleKeyPress = force => {
    if (!(this.state.moving || force)) {
      return;
    }

    const { keys } = this.state;

    const deltaX = keys['shift'] ? 20 : 1;
    const deltaY = deltaX;

    const onSetFontPosition = ({ x, y }) => {
      if (!this[`textSvgEl_${this.props.activeLayer.id}`]) {
        return;
      }
      if (this.props.activeLayers.length > 1) {
        const layerstoUpdate = this.props.activeLayers.map(activeLayer => ({
          id: activeLayer.id,
          position: {
            x: activeLayer.position.x + x,
            y: activeLayer.position.y + y
          }
        }));
        this.props.updateLayers(layerstoUpdate);
      } else {
        this.props.onSetPosition(
          {
            x: this.props.activeLayer.position.x + x,
            y: this.props.activeLayer.position.y + y
          },
          this.props.activeLayer.id
        );
      }
    };

    const onSetFramePosition = ({ x, y }) => {
      if (!this[`frameSvgEl_${this.props.activeLayer.id}`]) {
        return;
      }
      if (this.props.activeLayers.length > 1) {
        const layerstoUpdate = this.props.activeLayers.map(activeLayer => ({
          id: activeLayer.id,
          position: {
            x: activeLayer.position.x + x,
            y: activeLayer.position.y + y
          }
        }));
        this.props.updateLayers(layerstoUpdate);
      } else {
        this.props.onSetPosition(
          {
            x: this.props.activeLayer.position.x + x,
            y: this.props.activeLayer.position.y + y
          },
          this.props.activeLayer.id
        );
      }
    };

    //left
    if (keys[37]) {
      switch (this.props.activeLayer.target) {
        case 'text': {
          onSetFontPosition({
            x: -deltaX,
            y: 0
          });
          break;
        }

        case 'frame': {
          onSetFramePosition({
            x: -deltaX,
            y: 0
          });
          break;
        }

        default:
          break;
      }
    }

    //right
    if (keys[39]) {
      switch (this.props.activeLayer.target) {
        case 'text': {
          onSetFontPosition({
            x: deltaX,
            y: 0
          });

          break;
        }

        case 'frame': {
          onSetFramePosition({
            x: deltaX,
            y: 0
          });

          break;
        }

        default:
          break;
      }
    }

    //up
    if (keys[38]) {
      switch (this.props.activeLayer.target) {
        case 'text': {
          onSetFontPosition({
            x: 0,
            y: -deltaY
          });

          break;
        }

        case 'frame': {
          onSetFramePosition({
            x: 0,
            y: -deltaY
          });

          break;
        }

        default:
          break;
      }
    }

    //down
    if (keys[40]) {
      switch (this.props.activeLayer.target) {
        case 'text': {
          onSetFontPosition({
            x: 0,
            y: deltaY
          });

          break;
        }

        case 'frame': {
          onSetFramePosition({
            x: 0,
            y: deltaY
          });

          break;
        }

        default:
          break;
      }
    }
  };

  // ============== HELPERS SECTION =======================

  getCenteredFrameCoordinates = () => {
    const domNode = document.querySelector(
      `#frameSvg_${this.props.activeLayer.id} div div`
    );

    const { width = 0, height = 0 } = domNode
      ? domNode.getBoundingClientRect()
      : {};

    const { width: containerWidth = 0, height: containerHeight = 0 } = this
      .builderCanvas
      ? this.builderCanvas.getBoundingClientRect()
      : {};

    const centeredX = containerWidth / 2 - width / 2;
    const centeredY = containerHeight / 2 - height / 2;

    return {
      width,
      height,
      containerWidth,
      containerHeight,
      centeredX,
      centeredY
    };
  };
  getCenteredTextCoordinates = () => {
    const element = this[`textSvgEl_${this.props.activeLayer.id}`]
      ? this[`textSvgEl_${this.props.activeLayer.id}`].firstElementChild
      : null;
    const { width: containerWidth = 0, height: containerHeight = 0 } = this
      .builderCanvas
      ? this.builderCanvas.getBoundingClientRect()
      : {};
    const { width = 0, height = 0 } = !element ? {} : element.getBBox();

    const centeredX = containerWidth / 2 - width / 2;
    const centeredY = containerHeight / 2 - height / 2;

    return {
      width,
      height,
      containerWidth,
      containerHeight,
      centeredX,
      centeredY
    };
  };

  updateTransform = (id, data, refString) => {
    const element = this[`${refString}_${id}`];
    const controls = this[`${refString}_${id}_controls`];

    const {
      element: { transform },
      controls: { width, height, transform: transformControls }
    } = styler({
      x: data.x || this.props.activeLayers[0].position.x,
      y: data.y || this.props.activeLayers[0].position.y,
      scaleX: data.scaleX || this.props.activeLayers[0].scaleX,
      scaleY: data.scaleY || this.props.activeLayers[0].scaleY,
      width: data.width || this.props.activeLayers[0].width,
      height: data.height || this.props.activeLayers[0].height,
      angle:
        !!data.angle || data.angle === 0
          ? data.angle
          : this.props.activeLayers[0].angle
    });
    if (element) {
      element.style.transform = transform;
    }
    if (controls) {
      controls.style.width = width + 'px';
      controls.style.height = height + 'px';
      controls.style.transform = transformControls;
      controls.style.opacity = 0;
    }
  };

  updateLayer = (id, data) => {
    if (data) {
      this.props.updateLayer(id, {
        ...(data.x
          ? {
              position: {
                x: data.x,
                y: data.y
              }
            }
          : {}),
        ...(data.angle ? { angle: data.angle } : {}),
        ...(data.scaleX ? { scaleX: data.scaleX, scaleY: data.scaleY } : {})
      });
    }
  };
  handleTouchTranslation(event, { x, y }) {
    event.stopPropagation();
    event.preventDefault();
    const { activeLayers } = this.props;

    let positionDifference = {
      x: 0,
      y: 0
    };
    const drag = translate(
      {
        x: x,
        y: y,
        startX: event.changedTouches[0].pageX,
        startY: event.changedTouches[0].pageY
      },
      payload => {
        const xDiff = payload.x - x;
        const yDiff = payload.y - y;

        positionDifference = {
          x: xDiff || 0,
          y: yDiff || 0
        };

        activeLayers.forEach(activeLayer => {
          this.updateTransform(
            activeLayer.id,
            {
              x: activeLayer.position.x + positionDifference.x,
              y: activeLayer.position.y + positionDifference.y,
              scaleX: activeLayer.scaleX,
              scaleY: activeLayer.scaleY,
              angle: activeLayer.angle,
              width: activeLayer.width,
              height: activeLayer.height
            },
            activeLayer.target === 'frame' ? 'frameSvgEl' : 'textSvgEl'
          );
        });
      }
    );

    const up = () => {
      const layersToUpdate = activeLayers.map(activeLayer => {
        const refString =
          activeLayer.target === 'frame' ? 'frameSvgEl' : 'textSvgEl';
        const controls = this[`${refString}_${activeLayer.id}_controls`];

        controls.style.opacity = 1;
        return {
          id: activeLayer.id,
          position: {
            x: activeLayer.position.x + positionDifference.x,
            y: activeLayer.position.y + positionDifference.y
          }
        };
      });
      this.props.updateLayers(layersToUpdate);
      document.removeEventListener('touchmove', drag, { passive: false });
      document.removeEventListener('touchend', up);
    };

    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', up);
  }
  handleTranslation(event, { x, y }) {
    event.stopPropagation();
    event.preventDefault();
    const { activeLayers } = this.props;

    let positionDifference = {
      x: 0,
      y: 0
    };

    const drag = translate(
      {
        x: x,
        y: y,
        startX: event.pageX,
        startY: event.pageY
      },
      payload => {
        const xDiff = payload.x - x;
        const yDiff = payload.y - y;

        positionDifference = {
          x: xDiff || 0,
          y: yDiff || 0
        };

        activeLayers.forEach(activeLayer => {
          this.updateTransform(
            activeLayer.id,
            {
              x: activeLayer.position.x + positionDifference.x,
              y: activeLayer.position.y + positionDifference.y,
              scaleX: activeLayer.scaleX,
              scaleY: activeLayer.scaleY,
              angle: activeLayer.angle,
              width: activeLayer.width,
              height: activeLayer.height
            },
            activeLayer.target === 'frame' ? 'frameSvgEl' : 'textSvgEl'
          );
        });
      }
    );

    const up = () => {
      const layersToUpdate = activeLayers.map(activeLayer => {
        const refString =
          activeLayer.target === 'frame' ? 'frameSvgEl' : 'textSvgEl';
        const controls = this[`${refString}_${activeLayer.id}_controls`];

        controls.style.opacity = 1;
        return {
          id: activeLayer.id,
          position: {
            x: activeLayer.position.x + positionDifference.x,
            y: activeLayer.position.y + positionDifference.y
          }
        };
      });

      this.props.updateLayers(layersToUpdate);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }
  handleRotation(
    event,
    id,
    { x, y, scaleX, scaleY, width, height, angle, offsetX, offsetY },
    refString
  ) {
    event.stopPropagation();
    const domString =
      this.props.activeLayer.target === 'frame' ? 'frameSvg' : 'textSvg';
    const el1 = document
      .getElementById(`${domString}_${id}`)
      .getBoundingClientRect();
    const el2 = document
      .querySelector('.instructions-list')
      .getBoundingClientRect();
    const controlsDOM = this[`${refString}_${id}_controls`];
    const el1x = el1.left + el1.width / 2;
    const el1y = el1.top + el1.height / 2;
    const el2x = el2.left + el2.width / 2;
    const el2y = el2.top + el2.height / 2;

    const distanceSquared = Math.pow(el1x - el2x, 2) + Math.pow(el1y - el2y, 2);

    const distance = Math.sqrt(distanceSquared);

    let data;

    const drag = rotate(
      {
        startX: event.pageX,
        startY: event.pageY,
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        angle,
        offsetX: el1x - 400,
        offsetY: distance - 200
      },
      payload => {
        data = payload;
        this.updateTransform(id, payload, refString);
      }
    );

    const up = () => {
      this.props.onSetAngle(data.angle, id);
      if (controlsDOM) {
        controlsDOM.style.opacity = '1';
      }

      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', up);
  }

  handleTouchRotation(
    event,
    id,
    { x, y, scaleX, scaleY, width, height, angle, offsetX, offsetY },
    refString
  ) {
    event.preventDefault();
    event.stopPropagation();
    const controlsDOM = this[`${refString}_${id}_controls`];
    const domString =
      this.props.activeLayer.target === 'frame' ? 'frameSvg' : 'textSvg';
    const el1 = document
      .getElementById(`${domString}_${id}`)
      .getBoundingClientRect();
    const el2 = document
      .querySelector('.instructions-list')
      .getBoundingClientRect();

    const el1x = el1.left + el1.width / 2;
    const el1y = el1.top + el1.height / 2;
    const el2x = el2.left + el2.width / 2;
    const el2y = el2.top + el2.height / 2;

    const distanceSquared = Math.pow(el1x - el2x, 2) + Math.pow(el1y - el2y, 2);

    const distance = Math.sqrt(distanceSquared);

    let data;
    const drag = rotate(
      {
        startX: event.changedTouches[0].pageX,
        startY: event.changedTouches[0].pageY,
        x,
        y,
        scaleX,
        scaleY,
        width,
        height,
        angle,
        offsetX: el1x - 400,
        offsetY: distance - 200
      },
      payload => {
        data = payload;
        this.updateTransform(id, payload, refString);
      }
    );

    const up = () => {
      if (controlsDOM) {
        controlsDOM.style.opacity = '1';
      }
      this.props.onSetAngle(data.angle, id);
      document.removeEventListener('touchmove', drag, { passive: false });
      document.removeEventListener('touchend', up);
    };

    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', up);
  }

  onConfirm = id => {
    this.props.onLayerDelete(id);
    this.setState({ visible: false });
  };

  onDrop = e => {
    const shape = e.dataTransfer.getData('shape');
    const shapeParsed = JSON.parse(shape);

    if (shapeParsed) {
      const template = {
        target: 'frame',
        isBackground: shapeParsed.isBackground,
        color: { r: 10, g: 20, b: 30, a: 1 },
        width: 250,
        height: 0,
        scaleX: 1,
        scaleY: 1,
        frame: shapeParsed,
        angle: 0,
        name:
          shapeParsed.filename ||
          (shapeParsed.isBackground ? 'Background' : 'Frame'),
        active: true
      };
      this.props.onCreateLayer(template);
    }
  };
  // ============== RENDER SECTION =======================

  // RENDER ALL TEXT's
  renderDraggableText = (layer, index) => {
    const {
      font,
      value,
      color,
      position,
      width,
      height,
      scaleX,
      scaleY,
      angle,
      size,
      id,
      active
    } = layer;

    const { layers } = this.props;
    const { element: elementStyle, controls: controlsStyles } = styler({
      x: position.x,
      y: position.y,
      scaleX,
      scaleY,
      width,
      height,
      angle
    });
    const controlsDOM = this[`textSvgEl_${id}_controls`];
    return (
      <div
        key={id}
        className={`tr-transform`}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();

          const multiple =
            e.metaKey || e.ctrlKey || e.keyCode === 91 || e.keyCode === 224;

          if (!active) {
            setTimeout(() => this.setActiveById(id, multiple), 0);
            const TextInput = document.getElementsByClassName(
              'sidebar-section__input--text-input'
            )[0];
            TextInput && TextInput.focus();
          }

          if (active && this.props.activeLayers.length > 1 && multiple) {
            this.props.onRemoveActive(id);
          }
          if (active) {
            this.handleTranslation(e, { x: position.x, y: position.y });
          }
        }}
        onTouchStart={e => {
          if (!active) {
            this.setState({ visible: false });
            this.setActiveById(id);
          }
          if (active) {
            this.handleTouchTranslation(e, { x: position.x, y: position.y });
          }
        }}
      >
        <div
          className={`tr-transform__content`}
          style={{
            ...elementStyle,
            zIndex: (layers.length - index + 1) * 10
          }}
          ref={element => {
            this[`textSvgEl_${id}`] = element;
          }}
        >
          <TextSvg
            id={id}
            selectedFont={font}
            size={size}
            color={color}
            value={value}
            angle={angle}
            active={active}
          />
        </div>
        <div
          className={`tr-transform__controls`}
          hidden={!width}
          style={{
            ...controlsStyles,
            zIndex: active ? 200 : 20,
            cursor: 'move',
            ...(active ? { outline: '2px dashed #c8c8d2' } : {})
          }}
          ref={element => (this[`textSvgEl_${id}_controls`] = element)}
        >
          {active && this.props.activeLayers.length === 1 && (
            <Fragment>
              {this.props.isMobile && this.renderMobileShapeTools(id)}

              {['tl', 'ml', 'mr', 'tm', 'bm', 'tr', 'bl', 'br'].map(
                pointType => (
                  <EdgePoint
                    key={pointType}
                    onUpdate={data => {
                      this.updateTransform(id, data, 'textSvgEl');
                    }}
                    onUpdateEnd={data => {
                      if (controlsDOM) {
                        controlsDOM.style.opacity = 1;
                      }
                      if (data) {
                        this.props.onSetSize(id, {
                          ...(data.x
                            ? {
                                position: {
                                  x: data.x,
                                  y: data.y
                                }
                              }
                            : {}),
                          ...(data.angle ? { angle: data.angle } : {}),
                          ...(data.scaleX
                            ? { scaleX: data.scaleX, scaleY: data.scaleY }
                            : {})
                        });
                      }
                    }}
                    position={pointType}
                    x={position.x}
                    y={position.y}
                    width={width}
                    height={height}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    angle={angle}
                  />
                )
              )}
              <Rotator
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.handleRotation(
                    e,
                    id,
                    {
                      x: position.x,
                      y: position.y,
                      width,
                      height,
                      scaleX,
                      scaleY,
                      angle
                    },
                    'textSvgEl'
                  );
                }}
                onTouchStart={e => {
                  this.handleTouchRotation(
                    e,
                    id,
                    {
                      x: position.x,
                      y: position.y,
                      width,
                      height,
                      scaleX,
                      scaleY,
                      angle
                    },
                    'textSvgEl'
                  );
                }}
              />
            </Fragment>
          )}
        </div>
      </div>
    );
  };

  onVisibleChange = visible => {
    this.setState({
      visible
    });
  };

  handleToolsToggle = () => {
    this.setState(({ expandTools }) => ({
      expandTools: !expandTools
    }));
  };

  // RENDER ALL BACKGROUNDS

  renderMobileShapeTools = id => {
    const { expandTools } = this.state;
    return (
      <div className="tools-list">
        {expandTools && (
          <React.Fragment>
            <div
              className="tools-list__item duplicate-btn"
              onClick={() => {
                this.props.duplicateLayer(this.props.activeLayers);
              }}
            >
              <MdContentCopy />
            </div>
            <PopConfirm
              visible={this.state.visible}
              placement="left"
              okText="OK"
              cancelText="Cancel"
              onCancel={e => {
                e.stopPropagation();
                this.setState({ visible: false });
              }}
              onConfirm={e => this.onConfirm(id)}
              title="Are you sure to delete this frame?"
              onVisibleChange={this.onVisibleChange}
              trigger="click"
            >
              <div className="tools-list__item delete-btn">
                <FiTrash2 />
              </div>
            </PopConfirm>
          </React.Fragment>
        )}
        <div className="more-btn" onClick={this.handleToolsToggle}>
          <MdMoreVert />
        </div>
      </div>
    );
  };
  renderDraggableBackground = (layer, index) => {
    const {
      frame,

      position: { x, y },
      width,
      height,
      scaleX,
      scaleY,
      angle,
      id,
      active
    } = layer;
    const { layers, prevFrameRect } = this.props;
    if (!frame || frame.id === 0) {
      return null;
    }
    const controlsDOM = this[`frameSvgEl_${id}_controls`];
    // const frameColorValue = `rgb(${color.r}, ${color.g}, ${color.b})`;
    // const opacity = color.a;

    const { element: elementStyle, controls: controlsStyles } = styler({
      x: x,
      y: y,
      scaleX,
      scaleY,
      width,
      height,
      angle
    });

    const svgString = (
      <img
        id={`background_${id}`}
        src={frame.imgUrl}
        style={{ width: this.props.isMobile ? 200 : 400 }}
        alt=""
      />
    );
    return (
      <div
        key={id}
        className={`tr-transform`}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          const multiple =
            e.metaKey || e.ctrlKey || e.keyCode === 91 || e.keyCode === 224;

          if (!active) {
            setTimeout(() => this.setActiveById(id, multiple), 0);
          }

          if (active && this.props.activeLayers.length > 1 && multiple) {
            this.props.onRemoveActive(id);
          }

          if (active) {
            this.handleTranslation(e, { x, y });
          }
        }}
        onTouchStart={e => {
          if (!active) {
            this.setState({ visible: false });
            this.setActiveById(id);
          }
          if (active) {
            this.handleTouchTranslation(e, { x, y });
          }
        }}
      >
        {this.props.activeLayer.height === 0 &&
          id === this.props.activeLayer.id &&
          prevFrameRect.transform && (
            <div
              className="loader-wrapper"
              style={{
                width: 250,
                height: 250,
                transform: prevFrameRect.transform,
                position: 'absolute',
                display: 'flex'
              }}
            >
              <Loader style={{ margin: 'auto' }} size="lg" />
            </div>
          )}
        <div
          id={`frameSvg_${id}`}
          className={`tr-transform__content`}
          style={{
            ...elementStyle,
            zIndex: (layers.length - index + 1) * 10
          }}
          ref={element => (this[`frameSvgEl_${id}`] = element)}
        >
          {svgString}
        </div>
        <div
          className={`tr-transform__controls`}
          hidden={!height}
          style={{
            ...controlsStyles,
            zIndex: active ? 200 : 20,
            cursor: 'move',
            ...(active ? { outline: '2px dashed #c8c8d2' } : {})
          }}
          ref={element => (this[`frameSvgEl_${id}_controls`] = element)}
        >
          {active && this.props.activeLayers.length === 1 && (
            <Fragment>
              {this.props.isMobile && this.renderMobileShapeTools(id)}
              {['tl', 'ml', 'mr', 'tm', 'bm', 'tr', 'bl', 'br'].map(
                pointType => (
                  <EdgePoint
                    key={pointType}
                    onUpdate={data => {
                      this.updateTransform(id, data, 'frameSvgEl');
                    }}
                    onUpdateEnd={data => {
                      if (controlsDOM) {
                        controlsDOM.style.opacity = '1';
                      }
                      if (data) {
                        this.props.onSetSize(id, {
                          ...(data.x
                            ? {
                                position: {
                                  x: data.x,
                                  y: data.y
                                }
                              }
                            : {}),
                          ...(data.angle ? { angle: data.angle } : {}),
                          ...(data.scaleX
                            ? { scaleX: data.scaleX, scaleY: data.scaleY }
                            : {})
                        });
                      }
                    }}
                    position={pointType}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    angle={angle}
                  />
                )
              )}
              <Rotator
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.handleRotation(
                    e,
                    id,
                    {
                      x,
                      y,
                      width,
                      height,
                      scaleX,
                      scaleY,
                      angle
                    },
                    'frameSvgEl'
                  );
                }}
                onTouchStart={e => {
                  this.handleTouchRotation(
                    e,
                    id,
                    {
                      x,
                      y,
                      width,
                      height,
                      scaleX,
                      scaleY,
                      angle
                    },
                    'frameSvgEl'
                  );
                }}
              />
            </Fragment>
          )}
        </div>
      </div>
    );
  };
  // RENDER ALL FRAMES
  renderDraggableFrame = (layer, index) => {
    const {
      frame,
      color,
      position: { x, y },
      width,
      height,
      scaleX,
      scaleY,
      angle,
      id,
      active
    } = layer;
    const { layers, prevFrameRect } = this.props;

    if (!frame || frame.id === 0) {
      return null;
    }
    const controlsDOM = this[`frameSvgEl_${id}_controls`];
    const frameColorValue = `rgb(${color.r}, ${color.g}, ${color.b})`;
    const opacity = color.a;

    const { element: elementStyle, controls: controlsStyles } = styler({
      x: x,
      y: y,
      scaleX,
      scaleY,
      width,
      height,
      angle
    });
    return (
      <div
        key={id}
        className={`tr-transform`}
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          const multiple =
            e.metaKey || e.ctrlKey || e.keyCode === 91 || e.keyCode === 224;

          if (!active) {
            setTimeout(() => this.setActiveById(id, multiple), 0);
          }

          if (active && this.props.activeLayers.length > 1 && multiple) {
            this.props.onRemoveActive(id);
          }

          if (active) {
            this.handleTranslation(e, { x, y });
          }
        }}
        onTouchStart={e => {
          if (!active) {
            this.setState({ visible: false });
            this.setActiveById(id);
          }
          if (active) {
            this.handleTouchTranslation(e, { x, y });
          }
        }}
      >
        {this.props.activeLayer.height === 0 &&
          id === this.props.activeLayer.id &&
          prevFrameRect.transform && (
            <div
              className="loader-wrapper"
              style={{
                width: 250,
                height: 250,
                transform: prevFrameRect.transform,
                position: 'absolute',
                display: 'flex'
              }}
            >
              <Loader style={{ margin: 'auto' }} size="lg" />
            </div>
          )}
        <div
          id={`frameSvg_${id}`}
          className={`tr-transform__content`}
          style={{
            ...elementStyle,
            zIndex: (layers.length - index + 1) * 10
          }}
          ref={element => (this[`frameSvgEl_${id}`] = element)}
        >
          <ReactSVG
            src={require(`../assets/frames/${frame.name}.svg`)}
            beforeInjection={svg => {
              svg.setAttribute('fill', frameColorValue);
              svg.setAttribute('opacity', opacity);
            }}
            evalScripts="never"
            afterInjection={(err, svg) => {
              var fillSVG = document.querySelectorAll(
                `#frameSvg_${id} .withFill .st0`
              );

              fillSVG.forEach(node => {
                node.style.fill = frameColorValue;
              });

              svg.style.diplay = 'flex';

              if (!frame.hasViewBox) {
                try {
                  var box = svg.getBBox();
                  var viewBox = [box.x, box.y, box.width, box.height].join(' ');
                  svg.setAttribute('viewBox', viewBox);
                } catch (error) {}
              }

              if (this.props.activeLayers.length > 1) {
                return;
              }
              let frameSize;
              if (frame && this.props.activeLayer.target === 'frame') {
                frameSize = this.getCenteredFrameCoordinates();
              }

              if (
                frameSize &&
                this.props.activeLayer.id === layer.id &&
                this.props.activeLayer.height === 0
              ) {
                this.props.updateLayer(this.props.activeLayer.id, {
                  width: frameSize.width,
                  height: frameSize.height
                });
              }
            }}
          />
        </div>

        <div
          className={`tr-transform__controls`}
          hidden={!height}
          style={{
            ...controlsStyles,
            zIndex: active ? 200 : 20,

            cursor: 'move',
            ...(active ? { outline: '2px dashed #c8c8d2' } : {})
          }}
          ref={element => (this[`frameSvgEl_${id}_controls`] = element)}
        >
          {active && this.props.activeLayers.length === 1 && (
            <Fragment>
              {this.props.isMobile && this.renderMobileShapeTools(id)}
              {['tl', 'ml', 'mr', 'tm', 'bm', 'tr', 'bl', 'br'].map(
                pointType => (
                  <EdgePoint
                    key={pointType}
                    onUpdate={data => {
                      this.updateTransform(id, data, 'frameSvgEl');
                    }}
                    onUpdateEnd={data => {
                      if (controlsDOM) {
                        controlsDOM.style.opacity = '1';
                      }

                      if (data) {
                        this.props.onSetSize(id, {
                          ...(data.x
                            ? {
                                position: {
                                  x: data.x,
                                  y: data.y
                                }
                              }
                            : {}),
                          ...(data.angle ? { angle: data.angle } : {}),
                          ...(data.scaleX
                            ? { scaleX: data.scaleX, scaleY: data.scaleY }
                            : {})
                        });
                      }
                    }}
                    position={pointType}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    angle={angle}
                  />
                )
              )}
              <Rotator
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.handleRotation(
                    e,
                    id,
                    {
                      x,
                      y,
                      width,
                      height,
                      scaleX,
                      scaleY,
                      angle
                    },
                    'frameSvgEl'
                  );
                }}
                onTouchStart={e => {
                  this.handleTouchRotation(
                    e,
                    id,
                    {
                      x,
                      y,
                      width,
                      height,
                      scaleX,
                      scaleY,
                      angle
                    },
                    'frameSvgEl'
                  );
                }}
              />
            </Fragment>
          )}
        </div>
      </div>
    );
  };

  // RENDER ALL LAYERS
  renderBuilderLayers = () => {
    const { layers } = this.props;

    return layers.map((layer, index) => {
      if (layer.target === 'frame' && !layer.isBackground) {
        if (this.props.isMobile) {
          return this.renderDraggableFrame(layer, index);
        }

        return (
          <ContextMenuTrigger
            id="layerContextMenu"
            collect={props => props}
            layer={layer}
            key={layer.id}
          >
            {this.renderDraggableFrame(layer, index)}
          </ContextMenuTrigger>
        );
      }
      if (layer.target === 'frame' && layer.isBackground) {
        if (this.props.isMobile) {
          return this.renderDraggableBackground(layer, index);
        }
        return (
          <ContextMenuTrigger
            id="layerContextMenu"
            collect={props => props}
            layer={layer}
            key={layer.id}
          >
            {this.renderDraggableBackground(layer, index)}
          </ContextMenuTrigger>
        );
      }
      if (layer.target === 'text') {
        if (this.props.isMobile) {
          return this.renderDraggableText(layer, index);
        }

        return (
          <ContextMenuTrigger
            id="layerContextMenu"
            collect={props => props}
            layer={layer}
            key={layer.id}
          >
            {this.renderDraggableText(layer, index)}
          </ContextMenuTrigger>
        );
      }
      return null;
    });
  };

  renderMobileCanvas = () => {
    const {
      activeLayers,
      activeLayer,
      layers,
      hasFuture,
      hasPast,
      isMobile,
      activeSelector
    } = this.props;
    const blurAll = activeLayers.length > 1;
    const { color, id, isBackground } = activeLayer;
    return (
      <React.Fragment>
        <div
          className={classNames({
            'builder-mobile': true,
            'shrink-text': activeSelector === 'text',
            'shrink-frame':
              activeSelector === 'frame' || activeSelector === 'background'
          })}
        >
          <CanvasToolPanel
            hasFuture={hasFuture}
            hasPast={hasPast}
            undo={this.props.undo}
            redo={this.props.redo}
            activeLayer={activeLayer}
            layers={layers}
            activeLayers={activeLayers}
            blurAll={blurAll}
            handleColorChange={this.props.onSetColor}
            onChangeLayerOrder={this.props.onChangeLayerOrder}
            updateLayers={this.props.updateLayers}
            isMobile={isMobile}
            domRef={
              this[
                `${
                  activeLayer.target === 'text' ? 'textSvgEl' : 'frameSvgEl'
                }_${activeLayer.id}_controls`
              ]
            }
            setShowDownload={this.setShowDownload}
            updateTransform={this.updateTransform}
            onSetAngle={this.props.onSetAngle}
            updateLayer={this.props.updateLayer}
            onSetSize={this.props.onSetSize}
            setPosition={this.props.onSetPosition}
            handleAngleChange={this.props.onSetAngle}
            deleteBuilderDownloadData={this.props.deleteBuilderDownloadData}
            builderDownloadData={this.props.builderDownloadData}
            saveBuilderDownloadData={this.props.saveBuilderDownloadData}
            removeActive={this.props.onRemoveAllActive}
          />
          <div
            id="canvas"
            ref={element => {
              if (element) {
                this.builderCanvas = element;
              }
            }}
            style={{
              height: '100%',
              width: '100%'
            }}
            onTouchStart={e => {
              if (activeLayer.target) {
                e.stopPropagation();

                this.props.onRemoveAllActive();
              }
            }}
          >
            {this.renderBuilderLayers()}
          </div>
          {activeLayer.target && activeLayer.target !== 'temp' && (
            <ColorPicker
              value={
                color || {
                  r: 0,
                  g: 0,
                  b: 0,
                  a: 0
                }
              }
              isBackground={isBackground}
              onChange={this.changeColorDom}
              onSetColor={color => this.props.onSetColor(color.rgb, id)}
              activeLayer={activeLayer}
              isMobile
            />
          )}
        </div>
      </React.Fragment>
    );
  };

  renderDesktopCanvas = () => {
    const {
      activeLayers,
      activeLayer,
      layers,
      hasFuture,
      hasPast,
      builderLoadedMonogram
    } = this.props;
    const blurAll = activeLayers.length > 1;
    const { width, height } = this[
      `${activeLayer.target === 'text' ? 'textSvgEl' : 'frameSvgEl'}_${
        activeLayer.id
      }_controls`
    ]
      ? this[
          `${activeLayer.target === 'text' ? 'textSvgEl' : 'frameSvgEl'}_${
            activeLayer.id
          }_controls`
        ].style
      : {};

    return (
      <div className="builder-wrapper">
        <CanvasToolPanel
          hasFuture={hasFuture}
          hasPast={hasPast}
          undo={this.props.undo}
          redo={this.props.redo}
          activeLayer={activeLayer}
          activeLayers={activeLayers}
          layers={layers}
          blurAll={blurAll}
          onChangeLayerOrder={this.props.onChangeLayerOrder}
          updateLayers={this.props.updateLayers}
          builderLoadedMonogram={builderLoadedMonogram}
        />

        <div
          className="builder"
          style={{ display: 'flex' }}
          onDragOver={e => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onDrop={this.onDrop}
        >
          <ContextMenuTrigger id="canvasContextMenu" collect={props => props}>
            <div
              id="canvas"
              ref={element => {
                if (element) {
                  this.builderCanvas = element;
                }
              }}
              style={{
                height: '100%',
                width: '100%'
              }}
              onMouseDown={async e => {
                if (activeLayer.target) {
                  e.stopPropagation();
                  e.preventDefault();

                  setTimeout(() => this.props.onRemoveAllActive(), 0);
                }
              }}
            >
              {this.renderBuilderLayers()}
            </div>
          </ContextMenuTrigger>
          <BuilderLayers
            handleLayerClick={this.setActiveById}
            onRemoveActive={this.props.onRemoveActive}
            onRenameLayer={this.props.onRenameLayer}
            onChangeDisableEdit={this.props.onChangeDisableEdit}
            handleLayerOrderChange={this.props.onChangeLayerOrder}
            handleLayerDelete={this.props.onLayerDelete}
            layers={this.props.layers}
            createLayer={this.props.onCreateLayer}
          />

          <BuilderDownload
            deleteBuilderDownloadData={this.props.deleteBuilderDownloadData}
            builderDownloadData={this.props.builderDownloadData}
            saveBuilderDownloadData={this.props.saveBuilderDownloadData}
            layers={layers}
            removeActive={this.props.onRemoveAllActive}
          />
        </div>

        <CanvasContextMenu
          copiedlayers={this.props.copiedlayers}
          pasteLayer={this.props.pasteLayer}
        />
        <LayerContextMenu
          copiedlayers={this.props.copiedlayers}
          resetShapeStyle={this.props.resetShapeStyle}
          pasteLayer={this.props.pasteLayer}
          copyLayer={this.props.copyLayer}
          duplicateLayer={this.props.duplicateLayer}
          handleLayerDelete={this.props.onLayerDelete}
          activeLayers={this.props.activeLayers}
        />
        <BuilderControls
          layers={layers}
          blurAll={blurAll}
          constrolsBounds={{
            width: parseFloat(width),
            height: parseFloat(height)
          }}
          activeLayer={activeLayer}
          updateTransform={this.updateTransform}
          onSetAngle={this.props.onSetAngle}
          updateLayer={this.props.updateLayer}
          onSetSize={this.props.onSetSize}
          setPosition={this.props.onSetPosition}
          handleColorChange={this.props.onSetColor}
          handleAngleChange={this.props.onSetAngle}
          domRef={
            this[
              `${activeLayer.target === 'text' ? 'textSvgEl' : 'frameSvgEl'}_${
                activeLayer.id
              }_controls`
            ]
          }
        />
      </div>
    );
  };
  render() {
    const { isMobile } = this.props;

    return isMobile ? this.renderMobileCanvas() : this.renderDesktopCanvas();
  }
}
