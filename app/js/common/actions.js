import * as types from './actionTypes';
import bendService from '../bend/bendService'

export function likeRecentActivity(activity, like) {
  return dispatch => {
    bendService.likeActivity(activity, like, (error, result) => {
      
      if (error) {        
        console.log(error);
        dispatch({ type: types.RECENT_ACTIVITY_LIKE_ERROR });
      } 
      else {
        dispatch({ type: types.RECENT_ACTIVITY_LIKE_SUCCESS, result: result, recentActivityId: activity._id, recentActivityLike: like });
      }
    })
  }  
}

