import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Image,
} from 'react-native';

import * as commonColors from '../styles/commonColors';

const point_image = require('../../assets/imgs/point.png');

export default class Point extends Component {

  static propTypes = {
    point: PropTypes.number,
  }

  static defaultProps = {
    point: 0,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { point } = this.props;

    return (
      <View>
        <View style={ styles.pointContainer }>
          <Image style={ styles.imagePoint } source={ point_image }>
            <Text style={ styles.textPoint }>+{ point }</Text>            
          </Image>
        </View>
      </View>        
    );
  }
}

const styles = StyleSheet.create({
  pointContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    
  },
  imagePoint: {
    width: 28,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPoint: {
    backgroundColor: 'transparent',
    color: commonColors.point,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});