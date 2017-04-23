import * as types from './actionTypes';

const initialState = {
  status: null,
};

export default function common(state = initialState, action = {}) {
  console.log("common reducer", action)
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
    case types.ACTIVITY_CAPTURE_SUCCESS:
      return {
        ...state,
        status: 'capture_activity_success',
        activityId: action.activityId,
      };
    case types.ACTIVITY_REMOVE_SUCCESS:
      return {
        ...state,
        status: 'remove_activity_success',
        activityId: action.activityId,
      };
    default:
      return state;
  }
}
