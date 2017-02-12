'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import YouForm from '../components/youForm';
import * as youActions from '../actions';
import { connect } from 'react-redux';

class You extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, status } = this.props;
    return (
      <YouForm { ...actions } status/>
    );
  }
}

export default connect(state => ({
    status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(youActions, dispatch)
  })
)(You);
