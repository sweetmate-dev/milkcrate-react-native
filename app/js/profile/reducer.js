import * as types from './actionTypes';

const initialState = {
  status: null,
};

export default function profile(state = initialState, action = {}) {

  switch (action.type) {
    case types.PROFILE_REQUEST:
      return {
        ...state,
        status: 'profile_request',
      };
    case types.PROFILE_SUCCESS:
      return {
        ...state,
        status: 'profile_success',
      };
    case types.PROFILE_ERROR:
      return {
        ...state,
        status: 'profile_error',
      };
    default:
      return state;
  }
}
