import * as types from './actionTypes';

export function login(email, password, communityCode) {
  return {
    type: [types.LOGIN_REQUEST, types.LOGIN_SUCCESS, types.LOGIN_ERROR]
  };
}

