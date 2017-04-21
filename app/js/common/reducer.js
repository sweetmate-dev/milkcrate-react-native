import * as types from './actionTypes';

const initialState = {
  status: null,
};

export default function common(state = initialState, action = {}) {

  switch (action.type) {
    case types.RECENT_ACTIVITY_LIKE_SUCCESS:
      return {
        ...state,
        status: 'recent_activity_like_success',
        likeResult: action.result,
        recentActivityId: action.recentActivityId,
        recentActivityLike: action.recentActivityLike,
      };
    case types.RECENT_ACTIVITY_LIKE_ERROR:
      return {
        ...state,
        status: 'recent_activity_like_error',
      };
    default:
      return state;
  }
}
