import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  MapView,
  Alert,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');

const map_pin = require('../../../assets/imgs/map_pin.png');
const avatar = require('../../../assets/imgs/coffee_avatar.png');
const star = require('../../../assets/imgs/star.png');

export default class SearchMapForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  render() {
    const { status } = this.props;
    return (
      <MapView
        style={ styles.map }
        showsAnnotationCallouts = {true}
        region={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}

        annotations={[{
          latitude: 37.78825,
          longitude: -122.4324,
          title: 'Elixr Coffee Roasters',
          image: map_pin,
        }]}
      />

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  map: {
    height,
    width,
  },
  map_pin: {
    width: 10,
    height: 16,
  },
});