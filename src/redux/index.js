import { combineReducers } from 'redux';
// redux-undo higher-order reducer
import undoable, { includeAction } from 'redux-undo';
import builder from './builder';
import auth from './auth/reducer.js';
import gallery from './gallery/reducer';

export default combineReducers({
  builder: undoable(builder, {
    limit: 25,
    filter: includeAction([
      'SET_ANGLE',
      'SET_FRAME',
      'SET_BACKGROUND',

      'SET_COLOR',
      'SET_SIZE',
      'SET_POSITION',
      'CHANGE_LAYER_ORDER',
      'RENAME_LAYER',
      'UPDATE_LAYERS',
      'CREATE_LAYER',
      'DELETE_LAYER'
    ])
  }),
  auth,
  gallery
});
