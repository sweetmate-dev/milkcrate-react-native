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
  Alert,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const map_pin = require('../../../assets/imgs/map_marker.png');
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

  onCellPressed () {

    alert("onCellPressed");
  }

  render() {
    const { status } = this.props;
    const title = this.props.title;
    const avatar = this.props.avatar;

    return (
      <MapView
        style={ styles.map }
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <MapView.Marker
          image={ map_pin }
          key={ title }
          coordinate={ {latitude: 37.78825, longitude: -122.4324} }
        >
          <MapView.Callout style = { styles.calloutContainer }>
            <View style={ styles.cellContainer }>
              <View style={ styles.cellTopContainer }>
                <Image style={ styles.avatar } source={ avatar } />
                <View style={ styles.cellTopTextContainer }>
                  <View style={ styles.cellTopTitleRatingContainer }>
                    <View style={ styles.cellTopTitleContainer }>
                      <Text style={ styles.title }> { title }</Text>
                    </View>
                    <View style={ styles.cellTopRatingContainer }>
                      <Text style={ styles.text }>4.8</Text>
                      <Image style={ styles.star } source={ star } />
                    </View>
                  </View>
                  <Text style={ styles.text }>1.2 Miles  $$</Text>
                </View>
              </View>
              <View style={ styles.cellBottomContainer }>
                <Text style={ styles.dscription }>Great { title }, Great People, Great Service</Text>
              </View>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      </MapView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  map: {
    flex: 1,
  },
  map_pin: {
    width: 10,
    height: 16,
  },
  calloutContainer: {
    height: 63,
    width: width - 40,
  },
  cellContainer: {
    flex: 1,
    // height: 83,
    // width: width - 20,
    // backgroundColor: '#fff',
    // margin: 10,
    // paddingVertical: 8,
    // paddingHorizontal: 16,
    // borderWidth: 1,
    // borderColor: '#d4ebf6',
    // borderRadius: 5,
    // borderStyle: 'solid',
  },
  cellTopContainer: {
    flexDirection: 'row',
    flex:3,
    alignItems: 'center',
  },
  cellTopTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  cellTopTitleRatingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTopTitleContainer: {
    flex: 5,
    alignItems: 'flex-start',
  },
  cellTopRatingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cellBottomContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
  },
  star: {
    width: 12,
    height: 11,
    marginLeft: 3,
  },
  title: {
    color: '#5e8aa3',
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  dscription: {
    color: '#808080',
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  text: {
    color: '#a4a4a3',
    fontFamily: 'Open Sans',
    fontSize: 12,
    alignItems: 'center',
    paddingBottom: 5,
  },
});