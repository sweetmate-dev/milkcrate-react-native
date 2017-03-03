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
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import RecentActivityListCell from '../components/recentActivityListCell';

import { ProfileRecentActivityEntries } from '../../components/dummyEntries';

const avatar = require('../../../assets/imgs/avatar.png');

class You extends Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      recentActivityDataSource: dataSource.cloneWithRows(ProfileRecentActivityEntries)
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'you_request') {

    } else if (newProps.status == 'you_success') {

    } else if (newProps.status == 'you_error') {

    }
  }

  onPressedRecentActivityCell (rowID) {
    alert("Tapped cell - " + rowID);
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

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar/>
        <ScrollView>
          <View style={ styles.topContainer }>
            <Image style={ styles.avatar } source={ avatar }/>
            <View style={ styles.topRightContainer }>
              <View style={ styles.nameContainer }>
                <Text style={ styles.textName }>Philip Tribe</Text>
                <Text style={ styles.textDescription }>Eco Maven</Text>
              </View>
              <View style={ styles.pointContainer }>
                <View style={ styles.pointSubContainer }>
                  <Text style={ styles.textValue }>1298</Text>
                  <Text style={ styles.textSmall }>Total Points</Text>
                </View>
                <View style={ styles.pointSubContainer }>
                  <Text style={ styles.textValue }>323</Text>
                  <Text style={ styles.textSmall }>Sprints Points</Text>
                </View>
                <View style={ styles.pointSubContainer }>
                  <Text style={ styles.textValue }>8</Text>
                  <Text style={ styles.textSmall }>Volunteer Hours</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={ styles.title }>Recent Activity</Text>
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
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(youActions, dispatch)
  })
)(You);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  topRightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 15,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 5,
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textName: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textDescription: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    paddingLeft: 10,
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
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textSmall: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 10,
    backgroundColor: 'transparent',    
  },
  title: {
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
  
});
