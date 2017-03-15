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
  ListView,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as youActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import RecentActivityListCell from '../components/recentActivityListCell';

import { ProfileRecentActivityEntries } from '../../components/dummyEntries';

class Profile extends Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      recentActivityDataSource: dataSource.cloneWithRows(ProfileRecentActivityEntries)
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'profile_request') {

    } else if (newProps.status == 'profile_success') {

    } else if (newProps.status == 'profile_error') {

    }
  }

  onPressedRecentActivityCell(rowID) {
    Actions.WeeklyRecap();
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

  onSettings() {
    Actions.Settings();
  }

  onSeeCommunityPoints() {
    Actions.CommunityPoints();
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavSettingButton }
          onSetting={ this.onSettings }
        />
        <ScrollView>
          <View style={ styles.topContainer }>
            <Text style={ styles.textName }>Philip Tribe</Text>
            <View style={ styles.pointContainer }>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>129</Text>
                <Text style={ styles.textSmall }>Total Points</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>14th ></Text>
                <Text style={ styles.textSmall }>Leaderboard</Text>
              </View>
              <View style={ styles.pointSubContainer }>
                <Text style={ styles.textValue }>8</Text>
                <Text style={ styles.textSmall }>Hours Volunteered</Text>
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
    actions: bindActionCreators(youActions, dispatch)
  })
)(Profile);

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
    justifyContent: 'space-between',
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
