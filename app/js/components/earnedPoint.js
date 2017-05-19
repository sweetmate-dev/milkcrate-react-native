import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
} from 'react-native';

import { screenWidth, screenHeight } from '../styles/commonStyles';

const diamond = require('../../assets/imgs/diamond_solo.gif');

export default class EarnedPoint extends Component {

  static propTypes = {
    show: PropTypes.bool,
  }

  static defaultProps = {
    show: false,
  }

  constructor(props) {
    super(props);

    this.timer = 0;
    this.state = {
      show: this.props.show,
    }
  }


  componentWillReceiveProps(nextProps){

    if (this.show !== nextProps.show ) {
      this.setState({ show: nextProps.show });
    }
  }


  render() {
    if (this.state.show === false) {
      return null;
    }

    if (this.timer === 0) {
      this.timer = setInterval(() => {
        this.setState({ show: false });
        clearInterval(this.timer);
        this.timer = 0;
      }, 2500)
    }

    return (
      <Image source={ diamond } style={ styles.imageAnimation } resizeMode="cover"/>
    );
  }
}


const styles = StyleSheet.create({  
  container: {
    flex: 1,
  },
  imageAnimation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
  },
});
