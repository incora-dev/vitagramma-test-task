import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './services/index.store';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SearchRelevantPackagePage from './containers/search-relevant-package-page/search-relevant-package-page';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Route path="/" component={SearchRelevantPackagePage}/>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
