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
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

const ASPECT_RATIO = screenWidth / screenHiehgt;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const map_pin = require('../../../assets/imgs/map_marker.png');
const map_selected_pin = require('../../../assets/imgs/map_marker_selected.png');

class CategoryMap extends Component {
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
          pin: map_pin,
          coordinate: {
            latitude: LATITUDE + SPACE,
            longitude: LONGITUDE + SPACE,
          },
        },
        {
          pin: map_pin,
          coordinate: {
            latitude: LATITUDE,
            longitude: LONGITUDE,
          },
        },
        {
          pin: map_pin,
          coordinate: {
            latitude: LATITUDE + SPACE,
            longitude: LONGITUDE - SPACE,
          },
        },
      ],
      tappedPin: 0,
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  componentDidMount() {

    this.setState( ( state) => {
      state.markers[this.state.tappedPin].pin = map_selected_pin;
      return state;
    });
  }

  onPressPin (index) {

    this.setState( ( state) => {
      state.markers[this.state.tappedPin].pin = map_pin;
      state.markers[index].pin = map_selected_pin;
      return state;
    });

    this.setState({ tappedPin: index });
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
          {
            this.state.markers.map( (marker, index) => (
              <MapView.Marker
                image={ marker.pin }
                key={ index }
                coordinate={ marker.coordinate }
                flat={ true }
                onPress={ () => this.onPressPin(index) }
              />
            ))            
          }
        </MapView>

        <View style={ styles.calloutContainer } >
          <CategoryDetailView
            width={ screenWidth - 20}
            title={ title + " - " + this.state.tappedPin.toString() }
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
)(CategoryMap);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutContainer: {
    position: 'absolute',
    bottom: 10,
    marginHorizontal: 10,
  },
});