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
import UtilService from '../../components/util';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainSearchPage: true,
      searchText: '',
      searchAutoFocus: false,
    };
  }

  componentWillReceiveProps(newProps) {
    if(newProps.selectedTab == 'search') {
      if(this.state.searchText == "") {
        this.setState({
          mainSearchPage: true
        });
      }
    } else {
      if (newProps.searchAutoFocus == true){
        this.setState({ searchAutoFocus: true });
      }
    }
  }

  componentDidMount() {
    if (this.props.searchAutoFocus == true){
      this.setState({ searchAutoFocus: true });
    }

    UtilService.mixpanelEvent("Viewed Search Screen")
  }

  onSearchChange(text) {
    this.setState({ searchText: text });
  }

  onSearchFocus() {
    this.setState({ 
      mainSearchPage: false,
      searchAutoFocus: false,
      searchText: '',
    });
  }

  onSearchCancel() {
    this.setState({ 
      searchAutoFocus: false,
      mainSearchPage: true 
    });
  }

  render() {
    return (
      <View style={ styles.container }>
        <NavSearchBar
          onSearchChange={ (text) => this.onSearchChange(text) }
          onCancel={ () => this.onSearchCancel() }
          onFocus={ () => this.onSearchFocus() }
          searchAutoFocus={ this.state.searchAutoFocus }
        />
        {
          this.state.mainSearchPage ?
          <MainSearch
            subOne={ this.props.subOne }
          />
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
