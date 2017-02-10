'use strict';

import React, { Component } from 'react';
import IntroduceForm from '../components/introduceForm';

export default class Introduce extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { status } = this.props;

    return (
      <IntroduceForm status/>
    );
  }
}
