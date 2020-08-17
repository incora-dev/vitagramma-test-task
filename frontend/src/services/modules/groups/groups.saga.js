import { call, put, takeLatest, fork, all } from "redux-saga/effects";
import * as ActionTypes from './groups.actions';
import Api from './groups.api';

function* getGroups ({ payload }) {
  try {
    const { data } = yield call(Api.getGroups,payload);
    yield put(ActionTypes.getGroups.success(data));
  } catch (e) {
    yield put(ActionTypes.getGroups.failure(e));
  }
}

function* getGroupsSaga() {
  yield takeLatest(ActionTypes.GET_GROUPS, getGroups);
}

function* loadMoreGroups ({ payload }) {
  try {
    const { data } = yield call(Api.getGroups, payload);
    yield put(ActionTypes.loadMoreGroups.success(data));
  } catch (e) {
    yield put(ActionTypes.loadMoreGroups.failure(e));
  }
}

function* loadMoreGroupsSaga() {
  yield takeLatest(ActionTypes.LOAD_MORE_GROUPS, loadMoreGroups);
}

function* search({ testIds }) {
  try {
    const { data } = yield call(Api.search, testIds);
    yield put(ActionTypes.search.success(data));
  } catch (e) {
    yield put(ActionTypes.search.failure(e));
  }
}

function* searchSaga() {
  yield takeLatest(ActionTypes.SEARCH, search);
}

export default function* rootSaga() {
  yield all([
    fork(getGroupsSaga),
    fork(searchSaga),
    fork(loadMoreGroupsSaga),
  ]);
}