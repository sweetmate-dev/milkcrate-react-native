'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as communityPointsActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import RecentActivityListCell from '../components/recentActivityListCell';
import LeaderboardListCell from '../../components/leaderboardListCell';

import { ProfileRecentActivityEntries, LeaderboardEntries } from '../../components/dummyEntries';

class CommunityPoints extends Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    var dataSourceLeaderboard = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      recentActivityDataSource: dataSource.cloneWithRows(ProfileRecentActivityEntries),
      dataSourceLeaderboard: dataSourceLeaderboard.cloneWithRows(LeaderboardEntries),
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'profile_request') {

    } else if (newProps.status == 'profile_success') {

    } else if (newProps.status == 'profile_error') {

    }
  }

  onPressedRecentActivityCell(rowID) {
    alert("Tapped cell - " + rowID);
  }

  onLeaderboardCellPressed () {
    alert("Tapped Leaderboard");
  }

  renderRow(rowData, sectionID, rowID) {

    return (
      <RecentActivityListCell
        title={ rowData.title }
        icon={ rowData.icon }
        description= { rowData.description }
        distance={ rowData.distance }
        price={ rowData.price }
        coins={ rowData.coins }
        onClick={ () => this.onPressedRecentActivityCell(rowID) }
      />
    );
  }

  renderLeaderboardRow(rowData, sectionID, rowID) {

    return (
      <LeaderboardListCell
        status={ rowData.status }
        index={ Number(rowID) + 1 }
        name={ rowData.name }
        points={ rowData.points }
        avatar={ rowData.avatar }
      />
    );
  }

  onBack() {
    Actions.pop();
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
        />
        <ScrollView>
          <View style={ styles.topContainer }>
            <Text style={ styles.textName }>Comcast</Text>
            <View style={ styles.pointContainer }>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>1298</Text>
                <Text style={ styles.textSmall }>Total Points</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>8</Text>
                <Text style={ styles.textSmall }>Hours Volunteered</Text>
              </View>
            </View>
          </View>

          <View style={ styles.leaderboardContainer }>
            <Text style={ styles.textSectionTitle }>Comcast Leaderboard • You are in 4th place</Text>
            <TouchableHighlight onPress={ () => this.onLeaderboardCellPressed() }>
              <View style={ styles.leaderboardListViewWrapper }>
                <ListView
                  dataSource={ this.state.dataSourceLeaderboard }
                  renderRow={ this.renderLeaderboardRow.bind(this) }
                  contentContainerStyle={ styles.leaderboardListView}
                />
              </View>
            </TouchableHighlight>
          </View>

          <Text style={ styles.textSectionTitle }>Recent Activity</Text>
          <View style={ styles.recentActivityListViewWrapper }>
            <ListView
              dataSource={ this.state.recentActivityDataSource }
              renderRow={ this.renderRow.bind(this) }/>
          </View>
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
    backgroundColor: '#ebf6fb',
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
    fontFamily: 'Open Sans',
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
    height: commonStyles.hp(27),
  },
  leaderboardListView: {
    flex: 1,
    justifyContent: 'center',
  },

});
