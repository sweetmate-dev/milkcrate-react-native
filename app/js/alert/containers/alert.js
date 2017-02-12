'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import AlertForm from '../components/alertForm';
import * as alertActions from '../actions';
import { connect } from 'react-redux';

class Alert extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, status } = this.props;
    return (
      <AlertForm { ...actions } status/>
    );
  }
}

export default connect(state => ({
    status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(alertActions, dispatch)
  })
)(Alert);
