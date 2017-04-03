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

// import timer from 'react-native-timer';
import { Actions } from 'react-native-router-flux';
import NavSearchBar from '../../components/navSearchBar';
import { screenWidth, activityCellSize, categoryCellSize } from '../../styles/commonStyles';
import MainSearch from './mainSearch';
import FilterSearch from './filterSearch';

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

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }

    if (newProps.searchAutoFocus == true){
      // this.launchKeyboard();
       this.setState({ searchAutoFocus: true });

    }
  }

  componentDidMount() {

    if (this.props.searchAutoFocus == true){
      // this.launchKeyboard();
      this.setState({ searchAutoFocus: true });

    }
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

  // launchKeyboard() {

  //   timer.setTimeout( this, 'LaunchKeyboard', () => {
  //     timer.clearInterval(this, 'LaunchKeyboard');
  //     console.log('LaunchKeyboard' );
  //     this.setState({ searchAutoFocus: true });
  //   }, 300);
  // }

  render() {
    const { status } = this.props;
    console.log( "searchAutoFocus" , this.state.searchAutoFocus );

    return (
      <View style={ styles.container }>
        <NavSearchBar
          onSearchChange={ (text) => this.onSearchChange(text) }
          onCancel={ () => this.onSearchCancel() }
          onFocus={ () => this.onSearchFocus() }
          searchAutoFocus={ this.state.searchAutoFocus }
          searchMode={ true }
        />
        {
          this.state.mainSearchPage ?
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
