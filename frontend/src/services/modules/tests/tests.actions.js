export const GET_TESTS = 'GET_TESTS';
export const GET_TESTS_SUCCESS = 'GET_TESTS_SUCCESS';
export const GET_TESTS_FAILURE = 'GET_TESTS_FAILURE';

export const getTests = {
  request: (limit, offset, search) => ({ type: GET_TESTS, payload: { search, limit, offset } }),
  success: (tests) => ({ type: GET_TESTS_SUCCESS, tests }),
  failure: (error) => ({ type: GET_TESTS_FAILURE, error })
}

export const LOAD_MORE_TESTS = 'LOAD_MORE_TESTS';
export const LOAD_MORE_TESTS_SUCCESS = 'LOAD_MORE_TESTS_SUCCESS';
export const LOAD_MORE_TESTS_FAILURE = 'LOAD_MORE_TESTS_FAILURE';

export const loadMoreTests = {
  request: (limit, offset, search) => ({ type: LOAD_MORE_TESTS, payload: { search, limit, offset } }),
  success: (tests) => ({ type: LOAD_MORE_TESTS_SUCCESS, tests }),
  failure: (error) => ({ type: LOAD_MORE_TESTS_FAILURE, error })
}