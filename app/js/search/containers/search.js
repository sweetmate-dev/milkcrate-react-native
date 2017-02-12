'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import SearchForm from '../components/searchForm';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

class Search extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, status } = this.props;
    return (
      <SearchForm { ...actions } status/>
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
