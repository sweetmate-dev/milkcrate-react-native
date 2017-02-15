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

const { width, height } = Dimensions.get('window');

const items = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

class SearchList extends Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: dataSource.cloneWithRows(items)
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onCellPressed (rowID) {

    alert("Tapped cell - " + rowID);
  }

  renderRow(rowData, sectionID, rowID) {

    const title = this.props.title;
    const avatar = this.props.avatar;
    return (
      <CategoryDetailView
        title={ title }
        icon={ avatar }
        description="Great People, Great Service"
        distance={ 1.2 }
        price={ 1 }
        rating={ 4.8 }
        onClick={ () => this.onCellPressed(rowID) }
      />
    );
  }

  render() {
    const { status } = this.props;
    return (
      <ListView
        dataSource={ this.state.dataSource }
        renderRow={ this.renderRow.bind(this) }/>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(SearchList);
