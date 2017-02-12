'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import SearchMapForm from '../components/searchMapForm';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

class SearchMap extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, status } = this.props;
    return (
      <SearchMapForm { ...actions } status/>
    );
  }
}

export default connect(state => ({
    status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(SearchMap);
