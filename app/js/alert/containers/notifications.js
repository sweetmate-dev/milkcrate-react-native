'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ListView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as alertActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import AlertListCell from '../components/alertListCell';
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.dataSourceAlert = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      isRefreshing: false,
      alerts: []
    };
  }

  componentDidMount(){

    this.loadAllData();
  }

  loadAllData() {

    this.setState({
      alerts: []
    });

    bendService.getUserAlerts( (error, result)=>{

      this.setState({ isRefreshing: false });

      if(error) {
        console.log(error);
        return;
      }

      console.log("alerts", result)

      this.setState({
        alerts: result
      })
    })
  }

  renderAlertRow(rowData, sectionID, rowID) {
    return (
      <AlertListCell
        name={ rowData.actor.name }
        description={ rowData.message }
        avatar={ rowData.actor.avatar ? UtilService.getSmallImage(rowData.actor.avatar) : "" }
        avatarBackColor={ UtilService.getBackColor(rowData.actor.avatar) }
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        onClick={ () => this.onAlertCellPressed(rowData.activity) }
      />
    );
  }

  onAlertCellPressed (rowID) {
    // alert("Tapped cell - " + rowID);
  }

  onGoSearchScreen() {
    this.props.onSearch();
  }

  onRefresh() {
    this.setState({ isRefreshing: true });
    this.loadAllData();    
  }

  render() {
    return (
      <View style={ styles.container }>
        <NavSearchBar
          onGoSearchScreen={ () => this.onGoSearchScreen() }
          searchMode={ false }
        />
        <ScrollView
          style={ styles.listViewWrap }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.isRefreshing }
              onRefresh={ () => this.onRefresh() }
              tintColor={ commonColors.theme }
            />
          }
        >
        <ListView
          enableEmptySections={ true }
          dataSource={ this.dataSourceAlert.cloneWithRows(this.state.alerts) }
          renderRow={ this.renderAlertRow.bind(this) }/>
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(alertActions, dispatch)
  })
)(Notifications);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listViewWrap: {
    flex: 1,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
});
