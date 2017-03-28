'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import NavSearchBar from '../../components/navSearchBar';
import { screenWidth, activityCellSize, categoryCellSize } from '../../styles/commonStyles';
import MainSearch from './mainSearch';
import FilterSearch from './filterSearch';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainSearch: true,
      searchText: '',
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onSearchChange(text) {

    this.setState({ searchText: text });
  }

  onSearchFocus() {

    this.setState({ 
      mainSearch: false,
      searchText: '',
    });
  }

  onSearchCancel() {

    this.setState({ mainSearch: true });
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          onSearchChange={ (text) => this.onSearchChange(text) }
          onCancel={ () => this.onSearchCancel() }
          onFocus={ () => this.onSearchFocus() }
        />
        {
          this.state.mainSearch ?
          <MainSearch/>
          :
          <FilterSearch 
            searchText={ this.state.searchText }
          />
        }
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(Search);

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
});
