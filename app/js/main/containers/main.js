'use strict';

import React, { Component } from 'react';
import MainForm from '../components/mainForm';

export default class Main extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { status } = this.props;

    return (
      <MainForm status/>
    );
  }
}
