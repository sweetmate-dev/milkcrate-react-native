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
import { Actions } from 'react-native-router-flux';

import MapView from 'react-native-maps';
import BusinessesListCell from '../components/businessesListCell';
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

import UtilService from '../../components/util'

const ASPECT_RATIO = screenWidth / screenHiehgt;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const map_pin = require('../../../assets/imgs/map_marker.png');
const map_selected_pin = require('../../../assets/imgs/map_marker_selected.png');
const currentLocationMarker = require('../../../assets/imgs/current_location_marker.png');

class BusinessesMapView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: null,
      markers: [],
      tappedPin: 0,
    };

    this.watchID = null;
  }  

  componentDidMount() {
    this.setState( ( state) => {
      this.props.businesses.map( (business, index) => {
        state.markers[index] = {
          pin: map_pin,
          coordinate: {
            latitude: business._geoloc[1],
            longitude: business._geoloc[0],
          },
        };
      })
      state.markers[this.state.tappedPin].pin = map_selected_pin;
      return state;
    });
  }

  componentWillReceiveProps(nextProps) {

    this.setState({ currentLocation: nextProps.currentLocation });
  }

  onPressPin (index) {
    this.setState( ( state) => {
      state.markers[this.state.tappedPin].pin = map_pin;
      state.markers[index].pin = map_selected_pin;
      return state;
    });

    this.setState({ 
      tappedPin: index,
      currentLocation: null 
    });
  }

  onPressedCell (rowData) {
    Actions.BusinessesDetail({ business: rowData });
  }

  render() {
    const { 
      businesses,
    } = this.props;

    let region = null;

    if (this.state.currentLocation != null) {
      region = {
        latitude: this.state.currentLocation.coords.latitude,
        longitude: this.state.currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    } else {
      region = {
        latitude: businesses[this.state.tappedPin]._geoloc[1],
        longitude: businesses[this.state.tappedPin]._geoloc[0],
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
    }

    return (
      <View style={ styles.container }>
        <MapView
          style={ styles.map }
          region={ region }
          showsMyLocationButton={ false }
          showsPointsOfInterest={ false }
          loadingEnabled={ true }
        >
          {
            this.props.currentLocation && <MapView.Marker
              image={ currentLocationMarker }
              coordinate={ this.props.currentLocation.coords }
              flat={ true }                
            />
          }
          {
            this.state.markers.map( (marker, index) => (
              <MapView.Marker
                key={ index }
                image={ marker.pin }
                coordinate={ marker.coordinate }
                flat={ true }
                onPress={ () => this.onPressPin(index) }
              />
            ))            
          }          
        </MapView>
        <View style={ styles.calloutContainer }>
          <BusinessesListCell
            title={ businesses[this.state.tappedPin].name }
            icon={ UtilService.getCategoryIconFromSlug(businesses[this.state.tappedPin]) }
            description={ businesses[this.state.tappedPin].description }
            distance={ businesses[this.state.tappedPin]._geoloc ? UtilService.getDistanceFromLatLonInMile(businesses[this.state.tappedPin]._geoloc[1], businesses[this.state.tappedPin]._geoloc[0],
            this.props.currentLocation.coords.latitude, this.props.currentLocation.coords.longitude) : 1.0 }
            price={ Number(businesses[this.state.tappedPin].priceTier) }
            rating={ Number(businesses[this.state.tappedPin].rating || 0) }
            onClick={ () => this.onPressedCell(businesses[this.state.tappedPin]) }
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