import { call, put, takeLatest, fork, all } from "redux-saga/effects";
import * as ActionTypes from './tests.actions';
import Api from './tests.api';

function* getTests ({ payload }) {
  try {
    const { data } = yield call(Api.getTests, payload);
    yield put(ActionTypes.getTests.success(data));
  } catch (e) {
    yield put(ActionTypes.getTests.failure(e));
  }
}

function* getTestsSaga() {
  yield takeLatest(ActionTypes.GET_TESTS, getTests);
}

function* loadMoreTests ({ payload }) {
  try {
    const { data } = yield call(Api.getTests, payload);
    yield put(ActionTypes.loadMoreTests.success(data));
  } catch (e) {
    yield put(ActionTypes.loadMoreTests.failure(e));
  }
}

function* loadMoreTestsSaga() {
  yield takeLatest(ActionTypes.LOAD_MORE_TESTS, loadMoreTests);
}

export default function* rootSaga() {
  yield all([
    fork(getTestsSaga),
    fork(loadMoreTestsSaga),
  ]);
}