export const GET_GROUPS = 'GET_GROUPS';
export const GET_GROUPS_SUCCESS = 'GET_GROUPS_SUCCESS';
export const GET_GROUPS_FAILURE = 'GET_GROUPS_FAILURE';

export const getGroups = {
  request: (limit, offset, search) => ({ type: GET_GROUPS, payload: { search, limit, offset } }),
  success: (groups) => ({ type: GET_GROUPS_SUCCESS, groups }),
  failure: (error) => ({ type: GET_GROUPS_FAILURE, error })
}

export const LOAD_MORE_GROUPS = 'LOAD_MORE_GROUPS';
export const LOAD_MORE_GROUPS_SUCCESS = 'LOAD_MORE_GROUPS_SUCCESS';
export const LOAD_MORE_GROUPS_FAILURE = 'LOAD_MORE_GROUPS_FAILURE';

export const loadMoreGroups = {
  request: (limit, offset, search) => ({ type: LOAD_MORE_GROUPS, payload: { search, limit, offset } }),
  success: (groups) => ({ type: LOAD_MORE_GROUPS_SUCCESS, groups }),
  failure: (error) => ({ type: LOAD_MORE_GROUPS_FAILURE, error })
}

export const SEARCH = 'SEARCH';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

export const search = {
  request: (searchData) => ({ type: SEARCH, searchData }),
  success: (results) => ({ type: SEARCH_SUCCESS, results }),
  failure: (error) => ({ type: SEARCH_FAILURE, error })
}