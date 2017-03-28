'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import BusinessesListCell from '../components/businessesListCell';
import UtilService from '../../components/util'

import * as commonColors from '../../styles/commonColors';
import LoadMoreSpinner from '../../components/loadMoreSpinner';

class BusinessesListView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onPressedCell (rowData) {
    Actions.BusinessesDetail({ business: rowData });
  }

  renderRow(rowData, sectionID, rowID) {
    
    const caetgoriIcon = this.props.categoryIcons[rowID];

    // console.log ('business images : ', caetgoriIcon)

    return (
      <BusinessesListCell
        title={ rowData.name }
        icon={ caetgoriIcon }
        description={ rowData.description }
        distance={ rowData._geoloc&&this.props.currentLocation ? UtilService.getDistanceFromLatLonInMile(rowData._geoloc[1], rowData._geoloc[0],
        this.props.currentLocation.coords.latitude, this.props.currentLocation.coords.longitude) : 1.0 }
        price={ Number(rowData.priceTier) }
        rating={ Number(rowData.rating||0) }
        onClick={ () => this.onPressedCell(rowData) }
      />
    );
  }

  render() {
    const { 
      status,
      businesses,
      onLoadBusinesses,
      moreBusinesses,
      loading,
    } = this.props;

    return (
      <ScrollView>
        <ListView
          enableEmptySections={ true }
          dataSource={ this.dataSource.cloneWithRows(businesses) }
          renderRow={ this.renderRow.bind(this) }
          contentContainerStyle={ styles.categoryDetailListView }/>
        <LoadMoreSpinner
          show={ moreBusinesses }
          loading={ loading }
          onClick={ ()=> onLoadBusinesses() }
        />
      </ScrollView>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(BusinessesListView);

const styles = StyleSheet.create({
  categoryDetailListView: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,    
  },
});