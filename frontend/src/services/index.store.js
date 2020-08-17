import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from './index.reducers';
import rootSaga from './index.sagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = compose;

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga);
export default store;