'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import CategoryDetailView from '../components/categoryDetailView';
import { screenWidth, screenHiehgt } from '../../styles/comonStyles';

const ASPECT_RATIO = screenWidth / screenHiehgt;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const map_pin = require('../../../assets/imgs/map_marker.png');

class SearchMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      markers: [
        {
          key: "1",
          coordinate: {
            latitude: LATITUDE + SPACE,
            longitude: LONGITUDE + SPACE,
          },
        },
        {
          key: '2',
          coordinate: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
          },
        },
        {
          key: '3',
          coordinate: {
            latitude: LATITUDE + SPACE,
            longitude: LONGITUDE - SPACE,
          },
        },
      ],
      tappedPin: '1',
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onPressPin (key) {

    this.setState({tappedPin: key});
  }

  render() {
    const { status } = this.props;
    const title = this.props.title;
    const avatar = this.props.avatar;

    return (
      <View style={ styles.container }>
        <MapView
          style={ styles.map }
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              image={ map_pin }
              key={ marker.key }
              coordinate={ marker.coordinate }
              onPress={ () => this.onPressPin(marker.key) }
            />
          ))}

        </MapView>
        <View style={ styles.calloutContainer } >
          <CategoryDetailView
            width={ screenWidth - 20}
            title={ title + " - " + this.state.tappedPin }
            icon={ avatar }
            description="Great People, Great Service"
            distance={ 1.2 }
            price={ 1 }
            rating={ 4.8 }
            mode={ 1 }
          />
        </View>
      </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  map_pin: {
    width: 10,
    height: 16,
  },
  calloutContainer: {
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 10,
  },
});