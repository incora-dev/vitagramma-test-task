import tests from './modules/tests/tests.saga';
import groups from './modules/groups/groups.saga';
import { all, fork } from "redux-saga/effects";


export default function* rootSaga() {
  yield all([
    fork(tests),
    fork(groups)
  ])
}