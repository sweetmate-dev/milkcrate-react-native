import * as types from './actionTypes';

const initialState = {
  status: null,
};

export default function you(state = initialState, action = {}) {

  switch (action.type) {
    case types.YOU_REQUEST:
      return {
        ...state,
        status: 'you_request',
      };
    case types.YOU_SUCCESS:
      return {
        ...state,
        status: 'you_success',
      };
    case types.YOU_ERROR:
      return {
        ...state,
        status: 'you_error',
      };
    default:
      return state;
  }
}
