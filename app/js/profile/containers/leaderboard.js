'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as leaderboardActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

import LeaderboardListCell from '../components/leaderboardListCell';
import { LeaderboardEntries } from '../../components/dummyEntries';
import LoadMoreSpinner from '../../components/loadMoreSpinner';

//added by li, 2017/03/31
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

const comcast =   require('../../../assets/imgs/comcast.png');

class Leaderboard extends Component {
  
  constructor(props) {
    super(props);

    this.dataSourceLeaderboard = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      currentUserIndex: 3,
      userList:[],
      query:{
        offset:0,
        limit: 25,
        more: true,
        loading: false,
      }
    };

    this.loadUserPage.bind(this);
  }

  componentDidMount() {
    this.loadUserPage();
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'leaderboard_more_request') {

    } else if (newProps.status == 'leaderboard_more_success') {

    } else if (newProps.status == 'leaderboard_more_error') {

    }
  }

  loadUserPage() {
    if ( this.state.query.more === false )
      return;

    this.setState( (state) => {
      state.query.loading = true;
      return state;
    });

    bendService.getLeaderBoardPage(this.state.query.offset, this.state.query.limit + 1, (error, result) => {
      //console.log("getRecentActivities", error, result)
      this.setState( (state) => {
        state.query.loading = false;
        return state;
      });

      if (error) {
        console.log(error);
        return;
      }

      this.state.query.more = (result.length == this.state.query.limit + 1)
      if(this.state.query.more) {
        //remove tail item
        result.pop()
      }

      if(result.length > 0) {
        this.state.userList = this.state.userList.concat(result)
        this.state.query.offset += result.length
        this.setState({
          userList:this.state.userList
        })
      }

      this.setState({
        query:this.state.query
      })
    })
  }

  renderLeaderboardRow(rowData, sectionID, rowID) {

    var previousRank = rowData.previousRank, currentRank = rowData.rank
    if(previousRank == -1) previousRank = 10000;

    return (
      <LeaderboardListCell
          status={ previousRank<currentRank?2:(previousRank > currentRank?1:0) }
          index={ rowData.rank }
          name={ rowData.name }
          points={ rowData.points }
          avatar={ rowData.avatar ? UtilService.getSmallImage(rowData.avatar) : '' }
          avatarBackColor={UtilService.getBackColor(rowData.avatar)}
          defaultAvatar={UtilService.getDefaultAvatar(rowData.defaultAvatar)}
          currentUser={ bendService.getActiveUser().rank==rowData.rank }
      />
    );
  }
  
  onBack () {
    Actions.pop()
  }

  onCheckin() {
    alert("Tapped 'I Did This' button!");
  }

  render() {
    const { status, total } = this.props;
    const currentUser = bendService.getActiveUser();
    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ='LEADERBOARD'
        />
          <View style={ styles.orderContainer }>
            <Image source={ comcast } style={ styles.imageComcast }/>
            <Text style={ styles.textOrder }>{UtilService.getPositionString(currentUser.rank)} out of {total} people</Text>
          </View>

        <ScrollView>
          <ListView
              enableEmptySections={ true }
            dataSource={ this.dataSourceLeaderboard.cloneWithRows(this.state.userList) }
            renderRow={ this.renderLeaderboardRow.bind(this) }
            contentContainerStyle={ styles.leaderboardListView }
          />
          <LoadMoreSpinner
              show={ this.state.query.more }
              loading={ this.state.query.loading }
              onClick={ ()=> this.loadUserPage() }
          />
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(leaderboardActions, dispatch)
  })
)(Leaderboard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 35,
  },
  imageComcast: {
    width: 98,
    height: 40,
    marginBottom: 8,
  },
  textOrder: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  leaderboardListViewWrapper: {
    flex: 1,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  leaderboardListView: {
    flex: 1,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,    
  },
});