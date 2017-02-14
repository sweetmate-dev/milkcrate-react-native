'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import SearchViewForm from '../components/searchViewForm';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

class SearchView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SearchViewForm { ...this.props } />
    );
  }
}

export default connect(state => ({
    status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(SearchView);
