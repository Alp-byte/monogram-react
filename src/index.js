import 'rc-collapse/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React from 'react';
import { render } from 'react-dom';
import App from './app';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { Provider } from 'react-redux';
const Render = Component => {
  render(
    <Provider store={store}>
      <Component />
    </Provider>,
    document.getElementById('root')
  );
};

Render(App);

if (module.hot && process.env.NODE_ENV === 'development') {
  module.hot.accept('./app.js', () => {
    const NewApp = require('./app.js').default;
    Render(NewApp);
  });
}
serviceWorker.unregister();
