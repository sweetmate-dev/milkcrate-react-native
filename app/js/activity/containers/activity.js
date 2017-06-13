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
import * as activityActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import AlertListCell from '../components/alertListCell';
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

class Activity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,
    };
  }

  componentDidMount(){
    // UtilService.mixpanelEvent("Viewed Activity")
  }

  onRefresh() {
    this.setState({ isRefreshing: true });
  }

  onGoSearchScreen() {
    this.props.onSearch();
  }

  renderActivity() {
    return (
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
      
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={ styles.container }>
        <NavSearchBar
          onGoSearchScreen={ () => this.onGoSearchScreen() }
          searchMode={ false }
        />
        { this.renderActivity() }

      </View>
    );
  }
}

export default connect(state => ({
  status: state.activity.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(activityActions, dispatch)
  })
)(Activity);

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
