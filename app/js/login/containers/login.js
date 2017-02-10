'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import LoginForm from '../components/loginForm';
import * as loginActions from '../actions';
import { connect } from 'react-redux';

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, status } = this.props;
    return (
      <LoginForm { ...actions } status/>
    );
  }
}

export default connect(state => ({
    status: state.login.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(loginActions, dispatch)
  })
)(Login);
