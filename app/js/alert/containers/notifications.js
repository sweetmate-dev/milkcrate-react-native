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
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import * as alertActions from '../actions';
import { connect } from 'react-redux';
import AlertListCell from '../components/alertListCell';
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';

import { AlertEntries } from '../../components/dummyEntries';

//added by li, 2017/03/24
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.dataSourceAlert = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      alerts:[]
    };
  }

  componentDidMount(){
    bendService.getUserAlerts((err, rets)=>{
      if(err) {
        console.log(err);return
      }

      console.log("alerts", rets)

      this.setState({
        alerts:rets
      })
    })
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'alert_request') {

    } else if (newProps.status == 'alert_success') {

    } else if (newProps.status == 'alert_error') {

    }
  }

  onActivityCellPressed (a) {
    bendService.getActivity(a._id, (err, activity)=>{
      if(err) {
        console.log(err);return;
      }

      console.log("activity", activity)

      if(activity.type == 'business') {
        Actions.BusinessesDetail({ business: activity.activity });
      } else if(activity.type == 'action') {
        Actions.ActionDetail({ action: activity.activity });
      } else if(activity.type == 'event') {
        Actions.EventsDetail({ action: activity.activity });
      }
    })
  }

  renderAlertRow(rowData, sectionID, rowID) {
    return (
      <AlertListCell
        name={ rowData.actor.name }
        description={ rowData.message }
        avatar={ rowData.actor.avatar?UtilService.getSmallImage(rowData.actor.avatar):"" }
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        onClick={ () => this.onActivityCellPressed(rowData.activity) }
      />
    );
  }

  onAlertCellPressed (rowID) {
    alert("Tapped cell - " + rowID);
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <NavSearchBar/>
        <View style={ styles.listViewWrap }>
          <ListView
              enableEmptySections={ true }
              dataSource={
                this.dataSourceAlert.cloneWithRows(this.state.alerts)
              }
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
