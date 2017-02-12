import * as types from './actionTypes';

export function you() {
  return {
    type: [types.YOU_REQUEST, types.YOU_SUCCESS, types.YOU_ERROR]
  };
}

