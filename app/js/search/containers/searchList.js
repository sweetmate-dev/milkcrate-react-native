'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import SearchListForm from '../components/searchListForm';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

class SearchList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SearchListForm { ...this.props } />
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
