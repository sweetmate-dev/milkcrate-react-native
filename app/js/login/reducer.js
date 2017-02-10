import * as types from './actionTypes';

const initialState = {
  status: null,
};

export default function login(state = initialState, action = {}) {

  switch (action.type) {
    case types.LOGIN_REQUEST:
      return {
        ...state,
        status: 'login_request',
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        status: 'login_success',
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        status: 'login_error',
      };
    default:
      return state;
  }
}
