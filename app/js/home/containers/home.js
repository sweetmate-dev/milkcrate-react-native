'use strict';

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import HomeForm from '../components/homeForm';
import * as homeActions from '../actions';
import { connect } from 'react-redux';

class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { actions, status } = this.props;
    return (
      <HomeForm { ...actions } status/>
    );
  }
}

export default connect(state => ({
    status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(homeActions, dispatch)
  })
)(Home);
