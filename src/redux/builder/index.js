// TEXT SPECIFIC
const SET_FONT = 'SET_FONT';
const SET_TEXT_VALUE = 'SET_TEXT_VALUE';
const SET_DEFAULT_FONT = 'SET_DEFAULT_FONT';

// FRAME SPECIFIC
const SET_FRAME = 'SET_FRAME';

const SET_BACKGROUND = 'SET_BACKGROUND';

// SHARED PROPERTY
const SET_DEFAULT_POSITION = 'SET_DEFAULT_POSITION';
const SET_ANGLE = 'SET_ANGLE';
const SET_COLOR = 'SET_COLOR';
const SET_SIZE = 'SET_SIZE';
const SET_POSITION = 'SET_POSITION';
const SET_ACTIVE = 'SET_ACTIVE';
const CHANGE_LAYER_ORDER = 'CHANGE_LAYER_ORDER';
const CREATE_LAYER = 'CREATE_LAYER';
const DELETE_LAYER = 'DELETE_LAYER';
const REMOVE_ALL_ACTIVE = 'REMOVE_ALL_ACTIVE';
const REMOVE_ACTIVE = 'REMOVE_ACTIVE';
const CHANGE_DISABLE_EDIT = 'CHANGE_DISABLE_EDIT';
const RENAME_LAYER = 'RENAME_LAYER';
const UPDATE_LAYER = 'UPDATE_LAYER';
const UPDATE_LAYERS = 'UPDATE_LAYERS';
const SAVE_BUILDER_DOWNLOAD_DATA = 'SAVE_BUILDER_DOWNLOAD_DATA';
const DELETE_BUILDER_DOWNLOAD_DATA = 'DELETE_BUILDER_DOWNLOAD_DATA';
const SAVE_UPLOADED_FILES = 'SAVE_UPLOADED_FILES';
const DELETE_UPLOADED_FILE = 'DELETE_UPLOADED_FILE';
const COPY_LAYER = 'COPY_LAYER';
const PASTE_LAYER = 'PASTE_LAYER';
const DUPLICATE_LAYER = 'DUPLICATE_LAYER';
const RESET_STYLE = 'RESET_STYLE';
const SET_LAYERS = 'SET_LAYERS';

// AUTH

const FETCH_USER = 'FETCH_USER';

const initialState = {
  builderDownloadData: null,
  layers: [],
  defaultPosition: {},
  defaultFont: null,
  uploadedFiles: [],
  defaultColor: { r: 10, g: 20, b: 30, a: 1 },
  copiedlayers: [],
  prevFrameRect: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BACKGROUND: {
      const { id, background } = action.data;
      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          if (layer.target === 'frame' && layer.isBackground) {
            return {
              ...layer,
              name: background.filename || 'Background',
              frame: background,
              angle: 0,
              height: 0,
              scaleX: 1,
              scaleY: 1
            };
          }

          if (layer.target === 'temp') {
            return {
              ...layer,
              isBackground: true,
              frame: background,
              width: 400,
              height: 0,
              position: state.defaultPosition.frame,
              name: background.filename || 'Background',
              target: 'frame'
            };
          }
        }

        return layer;
      });
      return {
        ...state,
        layers: filteredDataSource
      };
    }
    case DELETE_UPLOADED_FILE: {
      const { id } = action.data;
      const uploadedFiles = state.uploadedFiles.filter(file => file.id !== id);
      return {
        ...state,
        uploadedFiles
      };
    }
    case SAVE_UPLOADED_FILES: {
      return {
        ...state,
        uploadedFiles: [...action.data, ...state.uploadedFiles]
      };
    }
    case RESET_STYLE: {
      const { prop, activeLayers } = action.data;
      let updatedLayers = state.layers.map(layer => {
        const found = activeLayers.find(s => s['id'] === layer['id']);
        if (found) {
          if (prop === 'all') {
            return { ...layer, ...found, scaleX: 1, scaleY: 1, angle: 0 };
          }

          if (prop === 'scale') {
            return { ...layer, ...found, scaleX: 1, scaleY: 1 };
          }

          if (prop === 'rotate') {
            return { ...layer, ...found, angle: 0 };
          }
        }
        return layer;
      });

      return { ...state, layers: updatedLayers };
    }
    case COPY_LAYER: {
      return {
        ...state,
        copiedlayers: action.data
      };
    }
    case PASTE_LAYER: {
      if (!state.copiedlayers.length) {
        return {
          ...state
        };
      }
      let layers = state.layers.map(layer => ({
        ...layer,
        active: false
      }));

      const copiedlayers = [...state.copiedlayers];
      const newCopiedlayers = copiedlayers.map(layer => {
        return {
          ...layer,
          id: layer.id + new Date().valueOf(),
          position: {
            x: layer.position.x + 30,
            y: layer.position.y + 30
          }
        };
      });

      return {
        ...state,
        layers: [...newCopiedlayers, ...layers]
      };
    }
    case DUPLICATE_LAYER: {
      if (!action.data.length) {
        return {
          ...state
        };
      }
      let layers = state.layers.map(layer => ({
        ...layer,
        active: false
      }));
      const duplicatedLayers = action.data.map(layer => {
        return {
          ...layer,
          position: {
            x: layer.position.x + 30,
            y: layer.position.y + 30
          },
          active: true,
          id: layer.id + new Date().valueOf()
        };
      });

      return {
        ...state,
        layers: [...duplicatedLayers, ...layers]
      };
    }
    case SET_DEFAULT_FONT: {
      const { defaultFont } = action.data;

      return { ...state, defaultFont };
    }
    case SET_FONT: {
      const { font, id } = action.data;

      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          if (layer.target === 'text') {
            return {
              ...layer,
              font
            };
          }

          if (layer.target === 'temp') {
            return {
              ...layer,
              font,
              position: state.defaultPosition.text,
              name: 'Text',
              target: 'text'
            };
          }
        }

        return layer;
      });
      // IF YES - CHANGE THIS LAYER TEXT FONT
      return { ...state, layers: filteredDataSource };
    }
    case SET_TEXT_VALUE: {
      const { id, text } = action.data;
      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          if (layer.target === 'text') {
            return {
              ...layer,
              value: text,
              ...(layer.value === layer.name ? { name: text } : {})
            };
          }

          if (layer.target === 'temp') {
            return {
              ...layer,
              value: text,
              width: 0,
              height: 0,
              position: state.defaultPosition.text,
              name: text,
              font: state.defaultFont,
              target: 'text'
            };
          }
        }

        return layer;
      });

      return { ...state, layers: filteredDataSource };
    }
    case SET_FRAME: {
      const { id, frame, prevFrameRect } = action.data;
      // CHECK IF ACTIVE IS FRAME
      // CHANGE FRAME TO ACTIVE LAYER FRAME
      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          if (layer.target === 'frame' && !layer.isBackground) {
            return {
              ...layer,
              frame,
              angle: 0,
              height: 0,
              scaleX: 1,
              scaleY: 1
            };
          }

          if (layer.target === 'temp') {
            return {
              ...layer,
              frame,
              width: 250,
              height: 0,
              position: state.defaultPosition.frame,
              name: 'Frame',
              target: 'frame'
            };
          }
        }

        return layer;
      });
      return {
        ...state,
        layers: filteredDataSource,
        prevFrameRect: prevFrameRect || {}
      };
    }

    case SET_COLOR: {
      const { color, id } = action.data;
      // FIND ACTIVE LAYER AND CHANGE ANGLE PROPERTY

      let layers = state.layers.map(layer => {
        if (layer.id === id) {
          return {
            ...layer,
            color
          };
        }

        return layer;
      });

      return {
        ...state,
        layers,
        defaultColor: color
      };
    }

    case SET_DEFAULT_POSITION: {
      const { position } = action.data;

      // FIND ACTIVE LAYER AND CHANGE SIZE PROPERTY
      return { ...state, defaultPosition: position };
    }

    case SET_SIZE: {
      const { id, payload } = action.data;
      // FIND ACTIVE LAYER AND CHANGE ANGLE PROPERTY
      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          return {
            ...layer,
            ...payload
          };
        }

        return layer;
      });

      return {
        ...state,
        layers: filteredDataSource
      };
    }
    case SET_POSITION: {
      const { position, id } = action.data;
      // FIND ACTIVE LAYER AND CHANGE POSITION PROPERTY

      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          return { ...layer, position };
        }
        return layer;
      });
      return { ...state, layers: filteredDataSource };
    }

    case SET_ANGLE: {
      const { angle, id } = action.data;
      // FIND ACTIVE LAYER AND CHANGE ANGLE PROPERTY

      let layers = state.layers.map(layer => {
        if (layer.id === id) {
          return {
            ...layer,
            angle
          };
        }

        return layer;
      });

      return {
        ...state,
        layers
      };
    }
    case SET_ACTIVE: {
      const { id, multiple } = action.data;
      // // FIND CURRENT ACTIVE - CHANGE active TO FALSE , FIND NEW ACTIVE BY ID AND CHANGE ACTIVE TO TRUE

      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.active && multiple && layer.target === 'temp') {
          return {
            ...layer,
            active: false
          };
        }
        if (layer.active && !multiple) {
          return {
            ...layer,
            active: false
          };
        }
        if (layer.id === id) {
          return {
            ...layer,
            active: true
          };
        }

        return layer;
      });

      return {
        ...state,
        layers: filteredDataSource
      };
    }
    case REMOVE_ACTIVE: {
      const { id } = action.data;

      let filteredDataSource = state.layers.map(layer => {
        if (layer.active && id === layer.id) {
          return {
            ...layer,
            active: false
          };
        }

        return layer;
      });

      return {
        ...state,
        layers: filteredDataSource
      };
    }
    case REMOVE_ALL_ACTIVE: {
      let layers = state.layers.map(layer => ({
        ...layer,
        active: false
      }));

      return {
        ...state,
        layers,
        prevFrameRect: {}
      };
    }

    case CHANGE_LAYER_ORDER: {
      const { layers, startIndex, endIndex } = action.data;

      const result = Array.from(layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      // FIND DRAGGED LAYER BY ID => CHANGE POSITION IN ARRAY TO NEW INDEX WHERE IT WAS DRAGGED
      return {
        ...state,
        layers: result
      };
    }

    case CREATE_LAYER: {
      // FIND DRAGGED LAYER BY ID => CHANGE POSITION IN ARRAY TO NEW INDEX WHERE IT WAS DRAGGED
      const id = new Date().valueOf();
      const { template } = action.data;
      const tempLayer = {
        target: 'temp',
        scaleX: 1,
        scaleY: 1,
        angle: 0,
        name: 'New Layer',
        active: true
      };
      const newLayer = template || tempLayer;
      if (newLayer.target !== 'temp') {
        newLayer.position =
          newLayer.target === 'frame'
            ? state.defaultPosition.frame
            : state.defaultPosition.text;
      }
      newLayer.id = id;
      newLayer.color = state.defaultColor;
      newLayer.disableEdit = true;
      const layers = Array.from(state.layers);
      const findCurrentActiveIndex = layers.findIndex(el => el.active);
      layers[findCurrentActiveIndex] = {
        ...layers[findCurrentActiveIndex],
        active: false
      };
      return {
        ...state,
        layers: [newLayer, ...layers]
      };
    }
    case UPDATE_LAYER: {
      const { id, payload } = action.data;
      // FIND ACTIVE LAYER AND CHANGE ANGLE PROPERTY

      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id) {
          return {
            ...layer,
            ...payload
          };
        }

        return layer;
      });

      return {
        ...state,
        layers: filteredDataSource
      };
    }

    case UPDATE_LAYERS: {
      const { layersToUpdate } = action.data;

      let updatedLayers = state.layers.map(layer => {
        const found = layersToUpdate.find(s => s['id'] === layer['id']);
        if (found) {
          return { ...layer, ...found };
        }
        return layer;
      });

      return {
        ...state,
        layers: updatedLayers
      };
    }
    case RENAME_LAYER: {
      const { name, id } = action.data;
      // FIND ACTIVE LAYER AND CHANGE POSITION PROPERTY

      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id && !layer.disableEdit) {
          return { ...layer, name };
        }
        return layer;
      });

      return { ...state, layers: filteredDataSource };
    }

    case CHANGE_DISABLE_EDIT: {
      const { disableEdit, id } = action.data;
      // FIND ACTIVE LAYER AND CHANGE POSITION PROPERTY

      let listCopy = [...state.layers];
      let filteredDataSource = listCopy.map(layer => {
        if (layer.id === id && layer.target !== 'temp') {
          return { ...layer, disableEdit };
        }
        return layer;
      });

      return { ...state, layers: filteredDataSource };
    }

    case DELETE_LAYER: {
      // FIND DRAGGED LAYER BY ID => CHANGE POSITION IN ARRAY TO NEW INDEX WHERE IT WAS DRAGGED
      const { id } = action.data;
      const layers = state.layers.filter(layer => layer.id !== id);
      return {
        ...state,
        layers,
        prevFrameRect: {}
      };
    }

    case SAVE_BUILDER_DOWNLOAD_DATA: {
      return {
        ...state,
        builderDownloadData: action.data
      };
    }
    case DELETE_BUILDER_DOWNLOAD_DATA: {
      return {
        ...state,
        builderDownloadData: null
      };
    }
    case SET_LAYERS: {
      // FIND DRAGGED LAYER BY ID => CHANGE POSITION IN ARRAY TO NEW INDEX WHERE IT WAS DRAGGED
      const { layers } = action.data;
    
      return {
        ...state,
        layers,
    
      };
    }

    default: {
      return state;
    }
  }
};

export const pasteLayer = () => ({
  type: PASTE_LAYER
});

export const copyLayer = data => ({
  type: COPY_LAYER,
  data
});
export const duplicateLayer = data => ({
  type: DUPLICATE_LAYER,
  data
});
export const resetShapeStyle = data => ({
  type: RESET_STYLE,
  data
});

export const saveUploadedFiles = data => ({
  type: SAVE_UPLOADED_FILES,
  data
});

export const deleteUploadFile = id => ({
  type: DELETE_UPLOADED_FILE,
  data: { id }
});

export const setBackground = (id, background) => ({
  type: SET_BACKGROUND,
  data: { id, background }
});

// TEXT SPECIFIC
export const setDefaultFont = defaultFont => ({
  type: SET_DEFAULT_FONT,
  data: { defaultFont }
});

export const setFont = (font, id) => ({
  type: SET_FONT,
  data: { font, id }
});
export const setText = (id, text) => ({
  type: SET_TEXT_VALUE,
  data: { id, text }
});

// FRAME SPECIFIC
export const setFrame = (id, frame, prevFrameRect) => ({
  type: SET_FRAME,
  data: { id, frame, prevFrameRect }
});

// SHARED ACTION CREATORS
export const setDefaultPosition = position => ({
  type: SET_DEFAULT_POSITION,
  data: { position }
});

export const setSize = (id, payload) => ({
  type: SET_SIZE,
  data: { id, payload }
});
export const setPosition = (position, id) => ({
  type: SET_POSITION,
  data: { position, id }
});
export const setAngle = (angle, id) => ({
  type: SET_ANGLE,
  data: { angle, id }
});

export const setActive = (id, multiple) => ({
  type: SET_ACTIVE,
  data: { id, multiple }
});

export const removeAllActive = id => ({
  type: REMOVE_ALL_ACTIVE,
  data: { id }
});

export const removeActive = id => ({
  type: REMOVE_ACTIVE,
  data: { id }
});

export const onLayerDelete = id => ({
  type: DELETE_LAYER,
  data: { id }
});

export const setColor = (color, id) => ({
  type: SET_COLOR,
  data: { color, id }
});

export const renamelayer = (name, id) => ({
  type: RENAME_LAYER,
  data: { name, id }
});

export const changeDisableEdit = (disableEdit, id) => ({
  type: CHANGE_DISABLE_EDIT,
  data: { disableEdit, id }
});

export const changeLayerOrder = (layers, startIndex, endIndex) => ({
  type: CHANGE_LAYER_ORDER,
  data: { layers, startIndex, endIndex }
});

export const createLayer = template => ({
  type: CREATE_LAYER,
  data: { template }
});

export const updateLayer = (id, payload) => ({
  type: UPDATE_LAYER,
  data: { id, payload }
});

export const updateLayers = layersToUpdate => ({
  type: UPDATE_LAYERS,
  data: { layersToUpdate }
});
export const setLayers = layers => ({
  type: SET_LAYERS,
  data: { layers }
});
export const saveBuilderDownloadData = data => ({
  type: SAVE_BUILDER_DOWNLOAD_DATA,
  data
});

export const deleteBuilderDownloadData = () => ({
  type: DELETE_BUILDER_DOWNLOAD_DATA
});

