import { combineReducers } from 'redux';
import groups from './modules/groups/groups.reducer';
import tests from './modules/tests/tests.reducer';

export default combineReducers({
  tests,
  groups,
});
