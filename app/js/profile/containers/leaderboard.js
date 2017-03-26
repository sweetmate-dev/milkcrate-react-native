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

const comcast =   require('../../../assets/imgs/comcast.png');

class Leaderboard extends Component {
  
  constructor(props) {
    super(props);

    var dataSourceLeaderboard = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSourceLeaderboard: dataSourceLeaderboard.cloneWithRows(LeaderboardEntries),
      currentUserIndex: 3,
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'leaderboard_more_request') {

    } else if (newProps.status == 'leaderboard_more_success') {

    } else if (newProps.status == 'leaderboard_more_error') {

    }
  }

  renderLeaderboardRow(rowData, sectionID, rowID) {
    
    let currentUser = false;
    if (rowID == this.state.currentUserIndex)
      currentUser = true;

    return (
      <LeaderboardListCell
        status={ rowData.status }
        index={ Number(rowID) + 1 }
        name={ rowData.name }
        points={ Math.max(Number(rowData.points||1), 1) }
        avatar={ rowData.avatar }
        currentUser={ currentUser }
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
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ='LEADERBOARD'
        />

        <View style={ styles.orderContainer }>
          <Image source={ comcast } style={ styles.imageComcast }/>
          <Text style={ styles.textOrder }>14th out of 674 people</Text>
        </View>
        
        <ListView
          dataSource={ this.state.dataSourceLeaderboard }
          renderRow={ this.renderLeaderboardRow.bind(this) }
          contentContainerStyle={ styles.leaderboardListView }
        />

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