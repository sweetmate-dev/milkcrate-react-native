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
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as alertActions from '../actions';
import { connect } from 'react-redux';
import AlertListCell from '../components/alertListCell';
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';

import { AlertEntries } from '../../components/dummyEntries';

class Notifications extends Component {
  constructor(props) {
    super(props);

    var dataSourceAlert = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSourceAlert: dataSourceAlert.cloneWithRows(AlertEntries),
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'alert_request') {

    } else if (newProps.status == 'alert_success') {

    } else if (newProps.status == 'alert_error') {

    }
  }

  renderAlertRow(rowData, sectionID, rowID) {
    return (
      <AlertListCell
        name={ rowData.name }
        description={ rowData.description }
        avatar={ rowData.avatar }
        time={ rowData.time }
        onClick={ () => this.onAlertCellPressed(rowID) }
      />
    );
  }

  onAlertCellPressed (rowID) {
    alert("Tapped cell - " + rowID);
  }

  onSearchFocus() {
    this.props.onSearch();
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <NavSearchBar
          onFocus={ () => this.onSearchFocus() }
        />
        <View style={ styles.listViewWrap }>
          <ListView
            dataSource={ this.state.dataSourceAlert }
            renderRow={ this.renderAlertRow.bind(this) }/>
        </View>
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
