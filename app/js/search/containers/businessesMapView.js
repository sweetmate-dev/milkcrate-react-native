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
import BusinessesListCell from '../components/businessesListCell';
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

const ASPECT_RATIO = screenWidth / screenHiehgt;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const map_pin = require('../../../assets/imgs/map_marker.png');
const map_selected_pin = require('../../../assets/imgs/map_marker_selected.png');
const currentLocationMarker = require('../../../assets/imgs/current_location_marker.png');

class BusinessesMapView extends Component {
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

    this.watchID = null;
  }  

  componentDidMount() {

    this.setState( ( state) => {
      state.markers[this.state.tappedPin].pin = map_selected_pin;
      return state;
    });
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
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
    const { status, title, avatar, currentLocation } = this.props;
    let region = this.state.region;

    if (currentLocation != null) {

      region=Object.assign({}, region, {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      
    }

    return (
      <View style={ styles.container }>
        <MapView
          style={ styles.map }
          region={ region }
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
          {
            currentLocation != null ? 
              <MapView.Marker
                image={ currentLocationMarker }
                coordinate={ currentLocation.coords }
                flat={ true }                
              />
            :
              null
          }
        </MapView>
        <View style={ styles.calloutContainer } >
          <BusinessesListCell
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
)(BusinessesMapView);

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