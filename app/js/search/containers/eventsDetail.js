'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  TextInput,
  TouchableOpacity,
  Alert,
Linking
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as eventsDetailActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import MapView from 'react-native-maps';
import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import Point from '../../components/Point';

//added by li, 2017/03/22
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

const icon =   require('../../../assets/imgs/category-stickers/bicycles.png');
const map_pin = require('../../../assets/imgs/map_marker.png');
const web = require('../../../assets/imgs/web.png');
const dummyText1 = 'Luxury is something everyone deserves from time to time. Such an indulgence can make a vacation a truly rejuvenating experience. One of the best ways to get the luxury of the rich and famous to fit into your budget can be yours through yacht charter companies. These companies specialize in creating custom sailing vacations that redefine travel.';

const ASPECT_RATIO = commonStyles.screenHiehgt / commonStyles.screenHiehgt;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class EventsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event:{},
      category:{
        coverImage:{
          _downloadURL:null
        }
      },
      initialize:false,
      didStatus:false,
      activityId:null,

      user:{},

      currentLocation:null,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },

    };
  }

  componentDidMount() {
    const eventId = "58d9cdec4bad30145b000567"
    bendService.getEvent(eventId, (err, ret)=>{
      if(err) {
        console.log(err);return;
      }
      
      this.state.event = ret;
      this.setState({
        event:ret
      })

      bendService.checkActivityDid(ret._id, 'event', (err, result)=>{
        if(err) {
          console.log(err);return;
        }

        if(result)
          this.state.activityId = result;

        this.setState({
          didStatus: result==false?false:true
        })
      })

      //console.log(action)
      if(ret.categories&&ret.categories.length >0) {
        bendService.getCategory(ret.categories[0], (err, ret)=>{
          if(err){
            console.log(err);return
          }

          this.setState({
            category:ret,
            initialize:true
          })
        })
      }

      navigator.geolocation.getCurrentPosition( (position) => {

            this.setState({ currentLocation: position })
          },
          (error) => {
            console.log(JSON.stringify(error));
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      bendService.getUser(bendService.getActiveUser()._id, (err, ret)=>{
        if(err) {
          console.log(err);return;
        }

        this.setState({
          user:ret
        })
      })
    })
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onBack () {
    Actions.pop()
  }

  onGetDirection() {
    var url = 'http://maps.apple.com/?ll=' + this.state.event._geoloc[1] + ',' + this.state.event._geoloc[0];
    Linking.openURL(url);
  }

  onGoWeb() {
    if(this.state.event.url)
      Linking.openURL(this.state.event.url);
  }

  onCheckIn() {
    bendService.captureActivity(this.state.event._id, 'event', (err,result)=>{
      if(err){
        console.log(err);return;
      }

      this.state.activityId = result.activity._id;

      this.setState({
        didStatus:true
      })
    })

    this.onGoWeb()
  }

  onUncheckIn() {
    bendService.removeActivity(this.state.activityId, (error, result)=>{
      if (error){
        console.log(error);
        return;
      }

      this.state.activityId = null;

      this.setState({
        didStatus: false
      })
    })
  }

  renderCoverImage() {
    var event = this.state.event;
    var coverImage, backgroundColor;
    if(this.state.initialize) {
      var imageObj = event.coverImage?event.coverImage:this.state.category.coverImage
      coverImage = UtilService.getMiddleImage(imageObj)
      backgroundColor = UtilService.getBackColor(imageObj)
    }

    if(coverImage == null) return null;

    return (
        <Image style={ [styles.map, {backgroundColor:backgroundColor}] } source={{ uri:coverImage }}>
        </Image>
    )
  }

  render() {
    const { status } = this.props;
    var event = this.state.event;

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title = {this.state.event.name}
        />
        <ScrollView>
          {event._geoloc&&<MapView
              style={ styles.map }
              initialRegion={ {
        latitude: Number(event._geoloc[1]),
        longitude: Number(event._geoloc[0]),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      } }
              scrollEnabled={ false }
              zoomEnabled={ false }
          >
            {
              <MapView.Marker
                  image={ map_pin }
                  style={styles.map_pin}
                  coordinate={{
                latitude: Number(event._geoloc[1]),
                longitude: Number(event._geoloc[0]),
                }}
              />
            }
          </MapView>}
          {!event._geoloc&&this.renderCoverImage()}
          <View style={ styles.mainContentContainer }>
            <View style={ styles.infoContainer }>
              <Image style={ styles.imageIcon } source={ UtilService.getCategoryIcon(this.state.category.slug) } />
              <View style={ styles.infoSubContainer }>
                <Text style={ styles.textTitle }>{event.name}</Text>
                {this.state.currentLocation&&<Text style={ styles.textValue }>
                  {event._geoloc?UtilService.getDistanceFromLatLonInMile(event._geoloc[1],event._geoloc[0],
                      this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude) + ' Miles':''}
                  </Text>}
              </View>
              <Point point={ Math.max(event.points||1, 1)} />
            </View>
            <View style={ styles.individualInfoContainer }>
              <View style={ styles.addressContainer }>
                <Text style={ styles.textAddress }>{event.address1} {event.address2}</Text>
                <Text style={ styles.textAddress }>{UtilService.getCityStateString(event.city, event.state, event.postalCode)}</Text>
                <TouchableOpacity onPress={ () => this.onGetDirection() }>
                  <Text style={ styles.textTitle }>Get Directions</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.visitContainer }>
                {this.state.didStatus&&UtilService.isValid(event.url)&&<TouchableOpacity onPress={ () => this.onGoWeb() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ web } />
                    <Text style={ styles.textInfoTitle }>Web</Text>
                  </View>
                </TouchableOpacity>}
              </View>
            </View>

            {event.times&& <View>
              {
                event.times.map((time, idx)=> {
                  return (
                      <View key={'time-' + idx} style={ styles.dateContinaer }>
                        <View style={ styles.dayWrapper }>
                          <Text style={ styles.textDay }>{UtilService.getDay(time.date)}</Text>
                        </View>
                        <View style={ styles.dateSubContentContainer }>
                          <Text style={ styles.textDate }>{UtilService.formatDateWithFormat2(new Date(time.date), 'MMMM DD, YYYY')}</Text>
                          <Text style={ styles.textValue }>{UtilService.getEventTime(time.from, time.until)}</Text>
                        </View>
                      </View>
                  )
                })
              }
            </View>}


            <Text style={ styles.textDescription }>{ event.description }</Text>
          </View>
        </ScrollView>
        {!this.state.didStatus&&<TouchableOpacity onPress={ () => this.onCheckIn() }>
          <View style={ styles.buttonCheckin }>
            <Text style={ styles.textButton }>Register</Text>
          </View>
        </TouchableOpacity>}
        {this.state.didStatus&&<TouchableOpacity onPress={ () => this.onUncheckIn() }>
          <View style={ styles.buttonGrey }>
            <Text style={ styles.textOrange }>I Can't Go</Text>
          </View>
        </TouchableOpacity>}
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(eventsDetailActions, dispatch)
  })
)(EventsDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(21),
  },
  mainContentContainer: {
    paddingLeft: 20,
    paddingRight: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  infoSubContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 40,
    height: 40,
  },
  textTitle: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  textValue: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  textDescription: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingVertical: 12,
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  textOrange: {
    color: '#F59174',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  buttonCheckin: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.bottomButton,
    height: 40,
  },
  buttonGrey: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    height: 40,
  },
  individualInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  addressContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textAddress: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  visitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInfoTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
    paddingTop: 5,
  },
  visitCellContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  imageVisit: {
    height: 48,
    width: 48,
  },
  dateContinaer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  dayWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.line,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  textDay: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  dateSubContentContainer: {
    paddingLeft: 8,
  },
  textDate: {
    color: commonColors.question,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
  },
});
