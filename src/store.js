import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux';
let store;
if (
  window.navigator.userAgent.includes('Chrome') &&
  process.env.NODE_ENV === 'development'
) {
  store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : e => e
    )
  );
} else {
  store = createStore(rootReducer, compose(applyMiddleware(thunk)));
}
export default store;
