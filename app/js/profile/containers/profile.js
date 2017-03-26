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
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as profileActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import RecentActivityListCell from '../components/recentActivityListCell';

import { ProfileRecentActivityEntries } from '../../components/dummyEntries';

//added by li, 2017/03/24
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

class Profile extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSourceRecentActivity: this.dataSource.cloneWithRows([]),
      acitivtyQuery:{
        createdAt: 0,
        limit: 25,
        more: true
      },
      currentLocation:null,
      categories:[],
      recentActivities:[]
    };

    this.loadRecentActivities.bind(this);
  }

  componentDidMount() {
    bendService.getCategories((error, cats)=>{
      this.setState({
        categories:cats
      })
    })

    this.loadRecentActivities()

    navigator.geolocation.getCurrentPosition( (position) => {

        console.log("position", position)
          this.setState({ currentLocation: position })
        },
        (error) => {
          console.log(JSON.stringify(error));
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'profile_request') {

    } else if (newProps.status == 'profile_success') {

    } else if (newProps.status == 'profile_error') {

    }
  }

  loadRecentActivities() {
    if(this.state.acitivtyQuery.more) {
      bendService.getMyRecentActivities(this.state.acitivtyQuery.createdAt, this.state.acitivtyQuery.limit + 1, (error, result) => {

        if (error) {
          console.log(error);
          return;
        }
        console.log("recent activities", result)
        this.state.acitivtyQuery.more = (result.length == this.state.acitivtyQuery.limit + 1)
        if(this.state.acitivtyQuery.more) {
          //remove tail item
          result.pop()
        }

        if(result.length > 0) {
          this.state.recentActivities = this.state.recentActivities.concat(result)
          this.state.acitivtyQuery.createdAt = result[result.length - 1]._bmd.createdAt
          this.setState({
            recentActivities:this.state.recentActivities
          })
        }

        this.setState({
          acitivtyQuery:this.state.acitivtyQuery
        })
      })
    }
  }

  onPressedRecentActivityCell(rowID) {
    Actions.WeeklyRecap();
  }

  renderRow(rowData, sectionID, rowID) {
    var cat = bendService.getActivityCategory(this.state.categories, rowData.activity)
    return (
      <RecentActivityListCell
        title={ rowData.activity.name||'' }
        icon={ UtilService.getCategoryIcon(cat) }
        description= { rowData.summary || '' }
        distance={ rowData.activity._geoloc&&this.state.currentLocation ? UtilService.getDistanceFromLatLonInMile(rowData.activity._geoloc[0], rowData.activity._geoloc[1],
        this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude) : -1 }
        price={ rowData.price||0 }
        points={ Number(rowData.points||0) }
        hearts={ Number(rowData.likeCount||0) }
        likeByMe={ rowData.likedByMe||false }
        onClick={ () => this.onPressedRecentActivityCell(rowID)
        }
        onLike={ () => this.onLike(rowData, !(rowData.likedByMe||false))
        }
      />
    );
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

  onSettings() {
    Actions.Settings();
  }

  onSeeCommunityPoints() {
    Actions.CommunityPoints();
  }

  render() {
    const { status } = this.props;
    const currentUser = bendService.getActiveUser()
    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavSettingButton }
          onSetting={ this.onSettings }
        />
        <ScrollView>
          <View style={ styles.topContainer }>
            <Text style={ styles.textName }>{currentUser.name}</Text>
            <View style={ styles.pointContainer }>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>129</Text>
                <Text style={ styles.textSmall }>Total Points</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>14th</Text>
                <Text style={ styles.textSmall }>Leaderboard</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>8</Text>
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
                renderRow={ this.renderRow.bind(this) }/>
          </View>
          {this.state.acitivtyQuery.more && <View style={ styles.loadMoreButtonWrapper }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.loadRecentActivities() }>
              <Text style={ styles.textReadMoreButton }>Load More</Text>
            </TouchableOpacity>
          </View>}
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.profile.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(profileActions, dispatch)
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
  loadMoreButtonWrapper: {
    flex: 1,
    paddingTop: 5,
    paddingBottom:5,
    justifyContent: 'center',
    alignItems:'center'
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textReadMoreButton: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});
