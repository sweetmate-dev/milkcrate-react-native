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
import * as eventDetailActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import RNCalendarEvents from 'react-native-calendar-events';
import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import Point from '../../components/Point';
import { LocalStorage } from '../../styles/localStorage';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

const icon =   require('../../../assets/imgs/category-stickers/bicycles.png');
const map_pin = require('../../../assets/imgs/map_marker.png');
const web = require('../../../assets/imgs/web.png');

const ASPECT_RATIO = commonStyles.screenHiehgt / commonStyles.screenHiehgt;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CALENDAR_EVENTS = 'CalendarEvents';

class EventDetail extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      didStatus: false,

      user: {},
      currentLocation: null,
      showAddToCalendar: true,
    };
    
    this.activityId = null;
    this.calendarEventIds = [];

    this.category = _.find(Cache.categories, (obj)=>{
      return obj._id == this.props.event.categories[0]
    })
  }

  componentDidMount() {
    const {
      event
    } = this.props;

    bendService.checkActivityDid(event._id, 'event', (error, result)=>{
      if (error) {
        console.log(error);
        return;
      }

      if (result) {
        this.activityId = result;

        LocalStorage.load({
          key: CALENDAR_EVENTS,
          id: this.activityId
        }).then( (data) => {

          console.log( 'Calendar event : ', data);
          this.setState({ showAddToCalendar: false });
        })
        .catch( (error) => {
          console.log('local storage error : ', error.message);
          this.setState({ showAddToCalendar: true });
        });
      }

      this.setState({
        didStatus: result == false ? false : true,
      })
    })

    navigator.geolocation.getCurrentPosition( (position) => {

       this.setState({ currentLocation: position })
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    bendService.getUser( (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.setState({
        user: result,
      })
    })
  }

  onBack () {
    Actions.pop()
  }

  onGetDirection() {
    var url = 'http://maps.apple.com/?ll=' + this.props.event._geoloc[1] + ',' + this.props.event._geoloc[0];
    Linking.openURL(url);
  }

  onGoWeb() {

    console.log('onGoWeb 1 : ', this.props.event.url);
    var url = UtilService.fixUrl(this.props.event.url);
    console.log('onGoWeb 2: ', url);

    if(url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        }
      }).catch((error)=>{
        //console.log("URL open error");
      });
    }
  }

  onCheckIn() {

    const {
      event
    } = this.props; 

    bendService.captureActivity(this.props.event._id, 'event', (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.activityId = result.activity._id;

      this.setState({
        didStatus: true,
      });
    })

    this.onGoWeb();
  }

  onAddToCalendar() {

    LocalStorage.load({
      key: CALENDAR_EVENTS,
      id: this.activityId
    }).then( (data) => {

      console.log( 'Calendar event : ', data);
      Alert.alert('Event Added', 'This event had been already added to your calendar.');
    })
    .catch( (error) => {
      console.log('local storage error : ', error.message);
      switch (error.name) {
        case 'NotFoundError':
          this.addEventToCalendar();
          break;
      }
    });
  }

  addEventToCalendar() {

    const {
      event
    } = this.props; 

    const address = event.address1 + " " + event.address2 + ", " + UtilService.getCityStateString(event.city, event.state, event.postalCode);
    
    RNCalendarEvents.authorizeEventStore()
        .then(status => {
          if (status === 'authorized') {
            event.times.map( (time, index)=> {

              let startDate = '';
              let endDate = '';
              let eventDate = '';

              if ((time.date === null) || (time.date === '')) {
                eventDate = UtilService.formatDateWithFormat2(new Date(), 'YYYY-MM-DD');
              } else {
                eventDate = time.date;
              }
              
              startDate = eventDate;
              endDate = eventDate;

              if ((time.from === null) || (time.from === ''))
                startDate += "T" + "00:00";
              else 
                startDate += "T" + time.from;
              
              if ((time.until === null) || (time.until === ''))
                endDate += "T" + "23:59";
              else 
                endDate += "T" + time.until;
              
              RNCalendarEvents.saveEvent(event.name, {
                  location: address,
                  notes: event.description,
                  startDate: UtilService.formatDateWithFormat2(startDate, "YYYY-MM-DDTHH:mm:ss.sssZ"),
                  endDate: UtilService.formatDateWithFormat2(endDate, "YYYY-MM-DDTHH:mm:ss.sssZ"),
                })
                .then( id => {
                  this.calendarEventIds[index] = id;
                  LocalStorage.save({
                    key: CALENDAR_EVENTS,
                    id: this.activityId,
                    rawData: this.calendarEventIds,
                  });

                  Alert.alert('Event Added', 'This event has been added to your calendar.');
                  this.setState({ showAddToCalendar: false });
                })
                .catch( error => {
                  console.log('error : ', error);
                });
            });
          }
        })
        .catch( error => {
          console.log('authorizeEventStore error : ', error);
        });
  }

  removeEventFromCalendar() {

    const activityId = this.activityId;
    this.activityId = null;
      
    LocalStorage.load({
      key: CALENDAR_EVENTS,
      id: activityId
    }).then( (data) => {

      console.log( 'Calendar event : ', data);
      
      data.map( (id, index ) => {
        RNCalendarEvents.removeEvent(id)
          .then( success => {
            if (index === (data.length - 1)) {
              alert('The event has been removed from Calendar');
              LocalStorage.remove({
                key: CALENDAR_EVENTS,
                id: activityId,
              });
            }
          })
          .catch( error => {
            console.log('remove envet error : ', error);
          });
      });
     
    })
    .catch( (error) => {
      console.log('local storage error : ', error.message);
    });
  }

  onUncheckIn() {
    bendService.removeActivity(this.activityId, (error, result) => {
      if (error){
        console.log(error);
        return;
      }

      this.removeEventFromCalendar();

      this.setState({
        didStatus: false,
      });
    })
  }

  renderCoverImage() {
    var {
      event,
    } = this.props;

    var coverImage, backgroundColor;
    var imageObj = event.coverImage ? event.coverImage : this.category.coverImage;
    coverImage = UtilService.getLargeImage(imageObj);
    backgroundColor = UtilService.getBackColor(imageObj);

    if (coverImage == null) 
      return null;

    return (
      <Image style={ [styles.map, { backgroundColor: backgroundColor }] } source={{ uri: coverImage }}/>
    )
  }

  render() {
    const { 
      event,
      modal,
    } = this.props;

    let grayButtonWidth = commonStyles.screenWidth;
    if (this.state.showAddToCalendar) {
      grayButtonWidth /= 2;
    }

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ modal ? commonStyles.NavCloseButton : commonStyles.NavBackButton }
          onBack={ this.onBack }
          title={ event.name }
        />
        <ScrollView>
          {
            event._geoloc && <MapView
              style={ styles.map }
              initialRegion={{
                latitude: Number(event._geoloc[1]),
                longitude: Number(event._geoloc[0]),
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              scrollEnabled={ false }
              zoomEnabled={ false }
            >
            {
              <MapView.Marker
                image={ map_pin }
                style={ styles.map_pin }
                coordinate={{
                  latitude: Number(event._geoloc[1]),
                  longitude: Number(event._geoloc[0]),
                }}
              />
            }
            </MapView>
          }
          { !event._geoloc && this.renderCoverImage() }
          <View style={ styles.mainContentContainer }>
            <View style={ styles.infoContainer }>
              <Image style={ styles.imageIcon } source={ UtilService.getCategoryIconFromSlug(event) } />
              <View style={ styles.infoSubContainer }>
                <Text style={ styles.textTitle }>{ event.name }</Text>
                { this.state.currentLocation && <Text style={ styles.textValue }>
                  { event._geoloc ? UtilService.getDistanceFromLatLonInMile(event._geoloc[1],event._geoloc[0],
                    this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude) + ' Miles' : '' }
                </Text>}
              </View>
              <Point point={ Math.max(event.points || 1, 1)} />
            </View>
            <View style={ styles.individualInfoContainer }>
              <View style={ styles.addressContainer }>
                <Text numberOfLines={ 2 } style={ styles.textAddress }>{ event.address1 } { event.address2 }</Text>
                <Text style={ styles.textAddress }>{ UtilService.getCityStateString(event.city, event.state, event.postalCode) }</Text>
                <TouchableOpacity onPress={ () => this.onGetDirection() }>
                  <Text style={ styles.textTitle }>Get Directions</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.visitContainer }>
                { this.state.didStatus && UtilService.isValidURL(event.url) && <TouchableOpacity onPress={ () => this.onGoWeb() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ web } />
                    <Text style={ styles.textInfoTitle }>Web</Text>
                  </View>
                </TouchableOpacity> }
              </View>
            </View>

            { event.times && <View>
              {
                event.times.map( (time, idx)=> {
                  return (
                    <View key={ 'time-' + idx } style={ styles.dateContinaer }>
                      <View style={ styles.dayWrapper }>
                        <Text style={ styles.textDay }>{ UtilService.getDay(time.date) }</Text>
                      </View>
                      <View style={ styles.dateSubContentContainer }>
                        <Text style={ styles.textDate }>{ UtilService.formatDateWithFormat2(new Date(time.date), 'MMMM DD, YYYY') }</Text>
                        <Text style={ styles.textValue }>{ UtilService.getEventTime(time.from, time.until) }</Text>
                      </View>
                    </View>
                  )
                })
              }
            </View> }
            <Text style={ styles.textDescription }>{ event.description }</Text>
          </View>
          { event.tags && event.tags.length>0 && <View style={ styles.tagsContainer }>
            <Text style={ styles.textHeading }>Tags</Text>
            <View style={ styles.tagsButtonContainer }>
              {
                event.tags.map((obj, index)=>{
                  return (
                    <View key={'tag-' + index} style={ styles.buttonTagsWrapper }>
                      <Text style={ styles.textTagsButton }>{obj}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View> }
        </ScrollView>
        { 
          !this.state.didStatus ?
          <TouchableOpacity onPress={ () => this.onCheckIn() }>
            <View style={ styles.buttonCheckin }>
              <Text style={ styles.textButton }>Register</Text>
            </View>
          </TouchableOpacity> 
          :
          <View style={ styles.bottomContainer }>
            <TouchableOpacity onPress={ () => this.onUncheckIn() }>
              <View style={ [styles.buttonGrey, { width: grayButtonWidth }] }>
                <Text style={ styles.textOrange }>I Can't Go</Text>
              </View>
            </TouchableOpacity>
            {
              this.state.showAddToCalendar ?
                <TouchableOpacity onPress={ () => this.onAddToCalendar() }>
                  <View style={ styles.buttonGreen }>
                    <Text style={ styles.textButton }>Add to Calendar</Text>
                  </View>
                </TouchableOpacity>
              :
                null
            }
          </View>
        }
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(eventDetailActions, dispatch)
  })
)(EventDetail);

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
    // width: commonStyles.screenWidth / 2,
  },
  buttonGreen: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.theme,
    height: 40,
    width: commonStyles.screenWidth / 2,
  },
  individualInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  addressContainer: {
    flex: 4.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textAddress: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  visitContainer: {
    flex: 1,
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
  tagsContainer: {
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 5,
  },
  tagsButtonContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonTagsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#EFEFEF",
    borderWidth: 5,
    borderStyle: 'solid',
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5
  },
  textTagsButton: {
    textAlign: 'center',
    backgroundColor: "#EFEFEF",
    color: "#A4A4A3",
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  textHeading: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    paddingVertical: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
