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
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

import CategoryDetailView from '../components/categoryDetailView';
import { CategoryDetailEntries } from '../../components/dummyEntries';
import UtilService from '../../components/util'

import * as commonColors from '../../styles/commonColors';

class CategoryList extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: this.dataSource.cloneWithRows(CategoryDetailEntries)
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onPressedCell (rowID) {
    alert("Tapped cell - " + rowID);
  }

  renderRow(rowData, sectionID, rowID) {
    const title = this.props.title;
    const avatar = this.props.avatar;
    return (
      <CategoryDetailView
        title={ rowData.name }
        icon={ avatar }
        description={ rowData.description }
        distance={ rowData._geoloc?UtilService.getDistanceFromLatLonInKm(rowData._geoloc[0], rowData._geoloc[1],
        this.props.currentLocation.latitude, this.props.currentLocation.longitude):1.0}
        price={ 10}
        rating={ Number(rowData.points) || 0 }
        onClick={ () => this.onPressedCell(rowID) }
      />
    );
  }

  render() {
    const { status } = this.props;
    return (
      <ListView
        enableEmptySections={ true }
        dataSource={ this.dataSource.cloneWithRows(this.props.activities) }
        renderRow={ this.renderRow.bind(this) }
        contentContainerStyle={ styles.categoryDetailListView }/>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(CategoryList);

const styles = StyleSheet.create({  
  categoryDetailListView: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,    
  },
});