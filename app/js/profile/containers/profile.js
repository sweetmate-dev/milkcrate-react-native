'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ListView,
  RefreshControl,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as profileActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as commonActions from '../../common/actions';

import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import RecentActivityListCell from '../components/recentActivityListCell';
import LoadMoreSpinner from '../../components/loadMoreSpinner';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

class Profile extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    
    this.state = {
      isRefreshing: false,

      activityQuery: {
        more: true,
        loading: false,
      },
      currentLocation: null,
      categories: [],
      recentActivities: [],
      currentUser: {}
    };

    this.activityQuery = { 
      more: true,
      createdAt: 0, 
      limit: 20 
    };
  }

  componentDidMount() {
    this.hasMounted = true
    this.loadAllData();

    if (this.props.subOne === 'community') {
      this.onSeeCommunityPoints();
    }

    UtilService.mixpanelEvent("Viewed Profile")
  }

  componentWillUnmount() {
    this.hasMounted = false
  }

  componentWillReceiveProps(newProps) {
    const { commonStatus, activityId } = newProps;
    //console.log("newProps", newProps)
    if(commonStatus === 'capture_activity_success') {
      //console.log("commonStatus", commonStatus, activityId)

      var exist = _.find(this.state.recentActivities, (obj) => {
        return obj._id == activityId;
      })

      if(exist) return;

      //add new recent activity
      bendService.getRecentActivity(activityId, (err, activity)=>{
        if(err) {
          console.log(err);return;
        }

        this.state.recentActivities.unshift(activity);
        this.hasMounted && this.setState({
          recentActivities:this.state.recentActivities
        })
      })
    } else if(commonStatus === 'remove_activity_success') {
      //console.log("commonStatus", commonStatus, activityId)

      //remove recent activity from list
      var exist = _.find(this.state.recentActivities, (obj) => {
        return obj._id == activityId;
      })

      if(exist) {
        var idx = this.state.recentActivities.indexOf(exist)
        this.state.recentActivities.splice(idx, 1);
        this.hasMounted && this.setState({
          recentActivities:this.state.recentActivities
        })
      }
    }

    bendService.getUserWithoutCache( (error, result) => {
      this.hasMounted&&this.setState({
        currentUser: result,
      })
    })
  }

  loadAllData() {
    bendService.getUser( (error, result) => {
      this.hasMounted&&this.setState({
        currentUser: result,
      })
    })
    this.hasMounted&&this.setState({
      activityQuery: {
        more: true,
        loading: false,
      },
      currentLocation: null,
      categories: [],
      recentActivities: []
    });

    this.activityQuery = { 
      more: true,
      createdAt: 0, 
      limit: 20 
    };

    bendService.getCategories((error, result)=>{
      this.hasMounted&&this.setState({
        categories: result,
      })
    })

    this.loadRecentActivities()

    navigator.geolocation.getCurrentPosition( 
      (position) => {
        //console.log("position", position)
          this.hasMounted&&this.setState({ currentLocation: position })
        },
        (error) => {
          console.log(JSON.stringify(error));
        },
        { enableHighAccuracy: commonStyles.geoLocation.enableHighAccuracy, timeout: commonStyles.geoLocation.timeout, maximumAge: commonStyles.geoLocation.maximumAge }
    );
  }

  loadRecentActivities() {
    if ( this.activityQuery.more === false )
      return;

    this.hasMounted&&this.setState( (state) => {
      state.activityQuery.loading = true;
      return state;
    });

    bendService.getMyRecentActivities(this.activityQuery.createdAt, this.activityQuery.limit + 1, (error, result) => {

      this.hasMounted&&this.setState( (state) => {
        state.activityQuery.loading = false;
        return state;
      });

      this.hasMounted&&this.setState({ isRefreshing: false });

      if (error) {
        console.log(error);
        return;
      }
      
      this.activityQuery.more = (result.length == this.activityQuery.limit + 1)

      this.hasMounted&&this.setState((state) => {
        state.activityQuery.more = this.activityQuery.more;
        return state;
      });

      if (this.activityQuery.more) {
        //remove tail item
        result.pop()
      }

      if (result.length > 0) {
        _.map(result, (o)=>{
          var exist = _.find(this.state.recentActivities, (_o)=>{
            return _o._id == o._id
          })

          if(!exist) {
            this.state.recentActivities.push(o)
          }
        })
        this.state.recentActivities = _.sortBy(this.state.recentActivities, (o)=>{
          return o._bmd.createdAt * (-1)
        })

        this.activityQuery.createdAt = result[result.length - 1]._bmd.createdAt
        this.hasMounted&&this.setState({
          recentActivities:this.state.recentActivities
        })
      }

      this.hasMounted&&this.setState({
        activityQuery:this.state.activityQuery
      })
    })
  }

  onRecentActivityCellPressed (activity) {
    if (activity.type == 'business') {
      Actions.BusinessesDetail({ business: activity.activity });
    } else if(activity.type == 'action') {
      Actions.ActionDetail({ action: activity.activity });
    } else if(activity.type == 'event') {
      Actions.EventDetail({ event: activity.activity });
    } else if(activity.type == 'service') {
      Actions.ServiceDetail({ service: activity.activity });
    } else if(activity.type == 'volunteer_opportunity') {
      Actions.VolunteerDetail({ volunteer: activity.activity });
    }
  }

  onPressedRecentActivityCell(rowID) {
    Actions.WeeklyRecap();
  }

  renderRow(rowData, sectionID, rowID) {
    var cat;
    if (rowData.type != 'poll') {
      cat = UtilService.getCategoryIcon(bendService.getActivityCategory(this.state.categories, rowData.activity));
    } else {
      cat = UtilService.getMilkCrateLogo();
    }
    /*if(cat == null)
        return null;*/
    return (
      <RecentActivityListCell
        title={ rowData.activity.name || rowData.summary || '' }
        icon={ cat }
        description= { rowData.summary || '' }
        points={ Math.max(Number(rowData.points || 1), 1) }
        hearts={ Number(rowData.likeCount || 0) }
        likeByMe={ rowData.likedByMe || false }
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        onClick={ () => this.onRecentActivityCellPressed(rowData)}
        onLike={ () => this.onLike(rowData, !(rowData.likedByMe || false))
        }
      />
    );
  }

  onLike(activity, like) {
    bendService.likeActivity(activity, like, (error, result)=>{
      if (error) {
        console.log(err);
        return;
      }

      var exist = _.find(this.state.recentActivities, (obj)=>{
        return obj._id == activity._id;
      })

      if (result && exist) {
        exist.likedByMe = like;
        
        if (like)
          exist.likeCount = Number(exist.likeCount || 0) + 1;
        else
          exist.likeCount = Math.max(Number(exist.likeCount || 0) - 1, 0);

        this.hasMounted&&this.setState({
          recentActivities:this.state.recentActivities,
        })
      }
    })
  }

  onSettings() {
    Actions.Settings();
  }

  onSeeCommunityPoints() {
    Actions.CommunityPoints();
  }

  onGoSearchScreen() {
    this.props.onSearch();
  }

  onRefresh() {
    this.hasMounted&&this.setState({ isRefreshing: true });
    this.loadAllData();    
  }

  render() {
    const currentUser = this.state.currentUser;
    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavSettingButton }
          onSetting={ this.onSettings }
          onGoSearchScreen={ () => this.onGoSearchScreen() }        
          searchMode={ false }
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={ this.state.isRefreshing }
              onRefresh={ () => this.onRefresh() }
              tintColor={ commonColors.theme }
            />
          }
        >
          <View style={ styles.topContainer }>
            <Text style={ styles.textName }>{ currentUser.name }</Text>
            <View style={ styles.pointContainer }>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>{ currentUser.points || 0 }</Text>
                <Text style={ styles.textSmall }>Total Points</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>{ UtilService.getPositionString(currentUser.rank) }</Text>
                <Text style={ styles.textSmall }>Leaderboard</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>{ currentUser.volunteerHours || 0 }</Text>
                <Text style={ styles.textSmall }>Volunteer Hours</Text>
              </View>
            </View>
          </View>

          <View style={ styles.buttonContainer }>
            <TouchableOpacity onPress={ () => this.onSeeCommunityPoints() }>
              <View style={ styles.buttonWrapper }>
                <Text style={ styles.textButton }>See Community Points</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={ styles.textSectionTitle }>Recent Activity</Text>
          <View style={ styles.recentActivityListViewWrapper }>
            <ListView
              enableEmptySections={ true }
              dataSource={ this.dataSource.cloneWithRows(this.state.recentActivities) }
              renderRow={ this.renderRow.bind(this) }
            />
          </View>
          <LoadMoreSpinner
            show={ this.state.activityQuery.more }
            loading={ this.state.activityQuery.loading }
            onClick={ ()=> this.loadRecentActivities() }
          />
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.profile.status,
  commonStatus: state.common.status,
  activityId: state.common.activityId,
  }),
  (dispatch) => ({
    actions: bindActionCreators(profileActions, dispatch),
    recentActivityLikeActions: bindActionCreators(commonActions, dispatch),
  })
)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    // backgroundColor: '#ebf6fb',
  },
  textName: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  pointContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  pointSubContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: commonStyles.screenWidth / 3,
  },
  textValue: {
    color: '#82ccbe',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textSmall: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  textSectionTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    padding: 10,
  },
  recentActivityListViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  buttonContainer: {
    paddingTop: 24,
    paddingBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    backgroundColor: commonColors.theme,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
