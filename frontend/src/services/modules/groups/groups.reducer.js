import * as Action from './groups.actions';
import { DEFAULT_LIMIT } from 'constants/common.constants';

const initialState = {
  groups: [],
  results: { groups: [], tests: [], bonuses: [] },
  hasMoreGroups: true,
  isSearching: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case Action.GET_GROUPS: {
      return {
        ...state,
        hasMoreGroups: true,
      };
    }
    case Action.GET_GROUPS_SUCCESS: {
      return {
        ...state,
        groups: action.groups
      };
    }
    case Action.GET_GROUPS_FAILURE: {
      return {
        ...state,
      };
    }

    case Action.LOAD_MORE_GROUPS: {
      return {
        ...state,
      };
    }
    case Action.LOAD_MORE_GROUPS_SUCCESS: {
      return {
        ...state,
        groups: [ ...state.groups, ...action.groups ],
        hasMoreGroups: action.groups.length === DEFAULT_LIMIT,
      };
    }
    case Action.LOAD_MORE_GROUPS_FAILURE: {
      return {
        ...state,
      };
    }

    case Action.SEARCH: {
      return {
        ...state,
        isSearching: true,
      };
    }
    case Action.SEARCH_SUCCESS: {
      return {
        ...state,
        results: action.results,
        isSearching: false,
      };
    }
    case Action.SEARCH_FAILURE: {
      return {
        ...state,
        isSearching: false,
      };
    }

    default:
      return state;
  }
};
