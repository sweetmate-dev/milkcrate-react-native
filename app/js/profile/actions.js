import * as types from './actionTypes';

export function profile() {
  return {
    type: [types.PROFILE_REQUEST, types.PROFILE_SUCCESS, types.PROFILE_ERROR]
  };
}

