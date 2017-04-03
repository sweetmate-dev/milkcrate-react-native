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
  TouchableHighlight,
  ListView,
  RefreshControl,
  Alert,
    Image
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as communityPointsActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import RecentActivityListCellForCommunity from '../components/recentActivityListCellForCommunity';
import SimpleLeaderboardListCell from '../components/simpleLeaderboardListCell';

import LoadMoreSpinner from '../../components/loadMoreSpinner';

//added by li, 2017/03/31
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

class CommunityPoints extends Component {
  constructor(props) {
    super(props);

    this.dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.dataSourceLeaderboard = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      isRefreshing: false,

      currentUserIndex: 0,
      userList:[],
      recentActivities:[],
      activityQuery:{
        more: true,
        loading: false,
      },
      currentUser:{},
      community:{}
    };

    this.activityQuery = { 
      more: true,
      createdAt: 0, 
      limit: 20 
    };

    this.totalUsers = 0;
  }

  componentDidMount() {

    this.loadAllData();
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'profile_request') {

    } else if (newProps.status == 'profile_success') {

    } else if (newProps.status == 'profile_error') {

    }
  }

  loadAllData() {

    bendService.getUser((err, ret)=>{
      this.setState({
        currentUser:ret
      })
    })

    bendService.getCommunity((err, ret)=>{
      if(!err)
        this.setState({
          community:ret
        })
    })

    this.setState({
      currentUserIndex: 0,
      userList:[],
      recentActivities:[],
      activityQuery:{
        more: true,
        loading: false,
      }
    });

    this.activityQuery = { 
      more: true,
      createdAt: 0, 
      limit: 20 
    };

    this.totalUsers = 0;

    bendService.getLeaderBoardSimpleList((err, userList, allUsers)=>{
      if(err) {
        console.log(err);return
      }

      var currentUserIndex = _.find(userList, (o)=>{
        return o._id == bendService.getActiveUser()._id
      })

      this.totalUsers = allUsers.length

      this.setState({
        currentUserIndex:currentUserIndex,
        userList:userList
      })
    })

    this.loadRecentActivities();
  }

  onPressedRecentActivityCell(rowID) {
    alert("Tapped cell - " + rowID);
  }

  onLeaderboardCellPressed () {
    Actions.Leaderboard({total:this.totalUsers});
  }

  loadRecentActivities() {

    if ( this.state.activityQuery.more === false )
      return;

    this.setState( (state) => {
      state.activityQuery.loading = true;
      return state;
    });

    bendService.getRecentActivities(this.activityQuery.createdAt, this.activityQuery.limit + 1, (error, result) => {
      //console.log("getRecentActivities", error, result)
      this.setState( (state) => {
        state.activityQuery.loading = false;
        return state;
      });

      this.setState({ isRefreshing: false });

      if (error) {
        console.log(error);
        return;
      }

      this.state.activityQuery.more = (result.length == this.activityQuery.limit + 1)

      this.setState((state) => {
        state.activityQuery.more = this.activityQuery.more;
        return state;
      });

      if(this.state.activityQuery.more) {
        //remove tail item
        result.pop()
      }

      if(result.length > 0) {
        this.state.recentActivities = this.state.recentActivities.concat(result)
        this.activityQuery.createdAt = result[result.length - 1]._bmd.createdAt
        this.setState({
          recentActivities:this.state.recentActivities
        })
      }

      console.log("this.state.recentActivities", this.state.recentActivities.length)

      this.setState({
        activityQuery:this.state.activityQuery
      })
    })
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {

    return (
    <RecentActivityListCellForCommunity
        name={ rowData.user.name || '' }
        description={ rowData.summary || '' }
        avatar={ rowData.user.avatar ? UtilService.getSmallImage(rowData.user.avatar) : '' }
        avatarBackColor={UtilService.getBackColor(rowData.user.avatar)}
        defaultAvatar={UtilService.getDefaultAvatar(rowData.user.defaultAvatar)}
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        hearts={ Number(rowData.likeCount||0) }
        likeByMe={ rowData.likedByMe||false }
        points={ Number(rowData.points||1) }
        onClick={ () => this.onRecentActivityCellPressed(rowData) }
        onLike={ () => this.onLike(rowData, !(rowData.likedByMe||false))
        }
    />
    );
  }

  onRecentActivityCellPressed (activity) {
    if(activity.type == 'business') {
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

  onLike(activity, like) {
    bendService.likeActivity(activity, like, (err, ret)=>{
      if(err) {
        console.log(err);
        return
      }

      var exist = _.find(this.state.recentActivities, (o)=>{
        return o._id == activity._id
      })
      if(ret && exist) {
        exist.likedByMe = like
        if(like)
          exist.likeCount = Number(exist.likeCount||0) + 1
        else
          exist.likeCount = Math.max(Number(exist.likeCount||0) - 1, 0)

        this.setState({
          recentActivities:this.state.recentActivities
        })
      }
    })
  }

  renderLeaderboardRow(rowData, sectionID, rowID) {

    var previousRank = rowData.previousRank, currentRank = rowData.rank
    return (
      <SimpleLeaderboardListCell
        status={ previousRank==-1?0:(previousRank<currentRank?2:(previousRank > currentRank?1:0)) }
        index={ rowData.rank }
        name={ rowData.name }
        points={ rowData.points }
        avatar={ rowData.avatar ? UtilService.getSmallImage(rowData.avatar) : '' }
        avatarBackColor={UtilService.getBackColor(rowData.avatar)}
        defaultAvatar={UtilService.getDefaultAvatar(rowData.defaultAvatar)}
        currentUserIndex={ bendService.getActiveUser().rank }
      />
    );
  }

  onBack() {
    Actions.pop();
  }

  onRefresh() {
    this.setState({ isRefreshing: true });
    this.loadAllData();    
  }

  render() {
    const { status } = this.props;
    const currentUser = this.state.currentUser
    const community = this.state.community

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ='Your Community'
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
            <View style={ styles.logoContainer }>
              {community.logo && <Image source={ {uri:community.logo._downloadURL} } style={ styles.imageComcast } resizeMode="contain"/>}
              {!community.logo && <Text style={ styles.textName }>{community.name}</Text>}
            </View>
            <View style={ styles.pointContainer }>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>{community.points||0}</Text>
                <Text style={ styles.textSmall }>Total Points</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>{community.hours||0}</Text>
                <Text style={ styles.textSmall }>Hours Volunteered</Text>
              </View>
            </View>
          </View>

          <View style={ styles.leaderboardContainer }>
            <Text style={ styles.textSectionTitle }>{community.name} Leaderboard • You are in {UtilService.getPositionString(currentUser.rank)} place</Text>
            <TouchableHighlight onPress={ () => this.onLeaderboardCellPressed() }>
              <View style={ styles.leaderboardListViewWrapper }>
                <ListView
                    enableEmptySections={ true }
                  dataSource={ this.dataSourceLeaderboard.cloneWithRows(this.state.userList) }
                  renderRow={ this.renderLeaderboardRow.bind(this) }
                  contentContainerStyle={ styles.leaderboardListView}
                />
              </View>
            </TouchableHighlight>
          </View>

          <Text style={ styles.textSectionTitle }>Recent Activity</Text>
          <View style={ styles.recentActivityListViewWrapper }>
            <ListView
                enableEmptySections={ true }
              dataSource={ this.dataSourceRecentActivity.cloneWithRows(this.state.recentActivities) }
              renderRow={ this.renderRecentActivityRow.bind(this) }/>
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
  status: state.profile.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(communityPointsActions, dispatch)
  })
)(CommunityPoints);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textName: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 24,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageComcast: {
    width: 300,
    height: 100,
    marginBottom: 8
  },
  pointContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  pointSubContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textValue: {
    color: commonColors.bottomButton,
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
  leaderboardContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  leaderboardListViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    height: 130,
  },
  leaderboardListView: {
    flex: 1,
    justifyContent: 'center',
  },
});
