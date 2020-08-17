import * as Action from './tests.actions';
import { DEFAULT_LIMIT } from 'constants/common.constants';

const initialState = {
  tests: [],
  hasMoreTests: true,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Action.GET_TESTS: {
      return {
        ...state,
      };
    }
    case Action.GET_TESTS_SUCCESS: {
      return {
        ...state,
        tests: action.tests,
        hasMoreTests: true,
      };
    }
    case Action.GET_TESTS_FAILURE: {
      return {
        ...state,
      };
    }

    case Action.LOAD_MORE_TESTS: {
      return {
        ...state,
      };
    }
    case Action.LOAD_MORE_TESTS_SUCCESS: {
      return {
        ...state,
        tests: [ ...state.tests, ...action.tests ],
        hasMoreTests: action.tests.length === DEFAULT_LIMIT,
      };
    }
    case Action.LOAD_MORE_TESTS_FAILURE: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
