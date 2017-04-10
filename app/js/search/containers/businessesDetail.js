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
  KeyboardAvoidingView,
  Linking,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as businessesDetailActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import MapView from 'react-native-maps';
import Point from '../../components/Point';
import Stars from 'react-native-stars-rating';
import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import BusinessRecentActivityListCell from '../components/businessRecentActivityListCell';

const map_pin = require('../../../assets/imgs/map_marker.png');
const star = require('../../../assets/imgs/star.png');
const phone = require('../../../assets/imgs/phone.png');
const web = require('../../../assets/imgs/web.png');

const ASPECT_RATIO = commonStyles.screenHiehgt / commonStyles.screenHiehgt;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'


class BusinessesDetail extends Component {
  constructor(props) {
    super(props);
    this.dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      initialize: true,
      didStatus: false,
      everDidStatus: true,
      activityId: null,

      currentLocation: null,
      businessRate: 0,
      businessComment: '',
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
      user: {},
      comments: [],
      trendUsers: [],
      trendUserCount: 0,
      lastTrendTime: Date.now() * 1000000,
      trendInit: false,
    };

    this.category = _.find(Cache.categories, (o)=>{
      return o._id == this.props.business.categories[0]
    })

    this.mounted = false
  }

  componentDidMount(){
    this.mounted = true;
    const business = this.props.business;

    bendService.checkActivityDid(business._id, 'business', (error, result) => {
      if (error) {
        console.log(err);
        return;
      }

      if (result)
        this.mounted && (this.state.activityId = result);

      this.mounted && this.setState({
        didStatus: result == false ? false : true,
      })
    })

    bendService.checkActivityAnybodyDid(business._id, 'business', (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.mounted && this.setState({
        everDidStatus: result,
      })
    })

    bendService.getBusinessRating(business._id, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.mounted && this.setState({
        comments: result
      })
    })

    navigator.geolocation.getCurrentPosition( (position) => {

        this.mounted && this.setState({ currentLocation: position })
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    bendService.getUser( (error, result)=>{
      if (error) {
        console.log(err);
        return;
      }

      this.mounted && this.setState({
        user: result,
      })
    })

    bendService.getBusinessTrend(business._id, (error, result)=>{
      if (error) {
        console.log(error);
        return;
      }

      this.setState({
        trendUsers: result.trendUsers,
        trendUserCount: result.trendUserCount,
        lastTrendTime: result.lastTrendTime,
        trendInit: true,
      })
    })
  }

  componentWillUnmount(){
    this.mounted = false
  }

  onBack () {
    Actions.pop()
  }

  onFilter () {
    alert("Tapped filter button!");
  }

  onCallPhone() {
    Linking.openURL('tel:' + this.props.business.phoneNumber);
  }

  onGoWeb() {
    Linking.openURL(this.props.business.url);
  }

  onGetDirection() {
    var url = 'http://maps.apple.com/?ll=' + this.props.business._geoloc[1] + ',' + this.props.business._geoloc[0];
    Linking.openURL(url);
  }

  onCertification(key) {
    alert("Tapped certification button!");
  }

  onRecentActivityCellPressed (rowID) {
    alert("Tapped cell - " + rowID);
  }

  onRateBusiness() {
    //console.log(this.state.businessRate, this.state.businessComment)
    if (this.state.businessRate > 0 || UtilService.isValid(this.state.businessComment)) {
      bendService.captureBusinessRating({
        id: this.props.business._id,
        comment: this.state.businessComment,
        rating: this.state.businessRate,
      }, (error, result)=>{
        if (error) {
          console.log(error);
          return;
        }

        this.state.comments.unshift(result);

        this.setState({
          businessRate: 0,
          businessComment: "",
          comments: this.state.comments,
        })
      })
    }
  }

  onCheckIn() {
    bendService.captureActivity(this.props.business._id, 'business', (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.mounted && (this.state.activityId = result.activity._id);

      this.mounted && this.setState({
        everDidStatus: true,
        didStatus: true,
      })
    })
  }

  onUncheckIn() {
    bendService.removeActivity(this.state.activityId, (error, result) => {
      if (error){
        console.log(error);
        return;
      }

      this.mounted && (this.state.activityId = null);

      this.mounted && this.setState({
        didStatus: false,
      })
    })
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {
    return (
      <BusinessRecentActivityListCell
        name={ rowData.user.name }
        description={ rowData.comment }
        avatar={ rowData.user.avatar ? UtilService.getSmallImage(rowData.user.avatar) : '' }
        avatarBackColor={ UtilService.getBackColor(rowData.user.avatar) }
        defaultAvatar={ UtilService.getDefaultAvatar(rowData.user.defaultAvatar) }
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        rating={ Number(rowData.rating || 0) }
        onClick={ () => this.onRecentActivityCellPressed(rowID) }
      />
    );
  }

  renderCoverImage() {
    const { business } = this.props;
    var coverImage, backgroundColor;
    if (this.state.initialize) {
      var imageObj = business.coverImage ? business.coverImage : this.category.coverImage;
      coverImage = UtilService.getMiddleImage(imageObj);
      backgroundColor = UtilService.getBackColor(imageObj);
    }

    if (coverImage == null) 
      return null;

    return (
        <Image style={ [styles.map, { backgroundColor:backgroundColor }] } source={{ uri:coverImage }}/>        
    )
  }

  getUsers(entries) {
    if (entries.length == 0) {
      return false;
    }

    return entries.map( (entry, index) => {

      if (index > 5)
        return null;
      
      if (!entry.defaultAvatar && !entry.avatar)
        return null;

      if (entry.avatar) {
        return (
            <Image key={ index} style={ styles.imageUserAvatar } source={{ uri:UtilService.getSmallImage(entry.avatar) }}/>
        );
      } else {
        return (
            <Image key={ index} style={ styles.imageUserAvatar } source={ UtilService.getDefaultAvatar(entry.defaultAvatar) }/>
        );
      }
    });
  }

  render() {
    const { 
      business,
    } = this.props;

    var rating = (business.rating || 0.0).toFixed(1);
    var avatar = this.state.user.avatar ? UtilService.getSmallImage(this.state.user.avatar) : null;
    var defaultAvatar = this.state.user.defaultAvatar ? UtilService.getDefaultAvatar(this.state.user.defaultAvatar) : null;
    var trendUsers = this.state.trendUsers;
    var trendUserCount = this.state.trendUserCount;
    var lastTrendTime = this.state.lastTrendTime;

    let icon = null;

    if (this.category !== undefined) {
      icon = UtilService.getCategoryIcon(this.category.slug);
    }

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title={ business.name }
        />
        <KeyboardAvoidingView style={ styles.keyboardAvoidingViewContainer } behavior={ 'padding' }>
        <ScrollView>
          { business._geoloc &&<MapView
            style={ styles.map }
            initialRegion={{
              latitude: Number(business._geoloc[1]),
              longitude: Number(business._geoloc[0]),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            scrollEnabled={ false }
            zoomEnabled={ false }
          >
            {
              <MapView.Marker
                image={ map_pin }
                coordinate={{
                  latitude: Number(business._geoloc[1]),
                  longitude: Number(business._geoloc[0]),
                }}
              />
            }
          </MapView>}
          { !business._geoloc && this.renderCoverImage() }

          <View style={ styles.mainContentContainer }>
            <View style={ styles.businessInfoContainer }>
              <Image style={ styles.imageIcon } source={ icon } />
              <View style={ styles.businessInfoSubContainer }>
                <Text style={ styles.textTitle }>{ business.name }</Text>
                { this.state.currentLocation && <Text style={ styles.textValue }>
                  { business._geoloc?UtilService.getDistanceFromLatLonInMile(business._geoloc[1],business._geoloc[0],
                  this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude) + ' Miles   ':''}
                  { UtilService.getPricesString(business.price) }</Text> 
                }
              </View>
              { (rating > 0) && <View style={ styles.businessInfoRatingContainer }>
                <Text style={ styles.textValue }>{ rating } </Text>
                <Image style={ styles.imageStar } source={ star } />
              </View> }
            </View>

            <View style={ styles.individualInfoContainer }>
              <View style={ styles.addressContainer }>
                <Text style={ styles.textAddress }>{ business.address1 } { business.address2 }</Text>
                <Text style={ styles.textAddress }>{ UtilService.getCityStateString(business.city, business.state) }</Text>
                <TouchableOpacity onPress={ () => this.onGetDirection() }>
                  <Text style={ styles.textTitle }>Get Directions</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.visitContainer }>
                { UtilService.isValid(business.phoneNumber) &&< TouchableOpacity onPress={ () => this.onCallPhone() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ phone } />
                    <Text style={ styles.textInfoTitle }>Phone</Text>
                  </View>
                </TouchableOpacity> }
                { UtilService.isValidURL(business.url) && <TouchableOpacity onPress={ () => this.onGoWeb() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ web } />
                    <Text style={ styles.textInfoTitle }>Web</Text>
                  </View>
                </TouchableOpacity> }
              </View>
            </View>
            {/*<Text style={ styles.textOpenNow }>Open Now</Text>*/}
            { business.hours && <View style={ styles.openNowContentContainer }>
              {
                  business.hours.map( (hour, idx) => {
                    return (
                      <View key={'hour-' + idx} style={ styles.openNowCellContainer }>
                        <Text style={ styles.textInfoTitle }>{ UtilService.getBusinessDay(hour.days) }</Text>
                        <Text style={ styles.textValue }>{ UtilService.getBusinessOpen(hour.open) }</Text>
                      </View>
                    )
                  }
                )
              }
            </View>}
            <Text style={ styles.textDescription }>{ business.description }</Text>
            { false && <TouchableOpacity onPress={ () => this.onGetDirection() }>
              <Text style={ styles.textDescription }>View on Foursquare</Text>
            </TouchableOpacity> }
          </View>
          { business.certification && business.certification.name && <View style={ styles.certificationsContainer }>
            <Text style={ styles.textHeading }>Certifications</Text>
            <View style={ styles.certificationsButtonContainer }>
            <View style={ styles.buttonCertificationsWrapper }>
              <Text style={ styles.textCertificationsButton }>{ business.certification.name }</Text>
            </View>
            </View>
          </View> }
          { business.tags && (business.tags.length > 0) && <View style={ styles.tagsContainer }>
            <Text style={ styles.textHeading }>Tags</Text>
            <View style={ styles.tagsButtonContainer }>
              {
                business.tags.map( (obj, index) => {
                  return (
                    <View key={'tag-' + index} style={ styles.buttonTagsWrapper }>
                      <Text style={ styles.textTagsButton }>{ obj }</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>}
          { 
            !this.state.everDidStatus && <View style={ styles.certificationsContainer }>
              <View style={ styles.certificationsCheckContainer }>
                { avatar && <Image style={ [styles.imageIcon, { backgroundColor:UtilService.getBackColor(avatar) }] } source={{ uri:avatar }} />}
                { !avatar && defaultAvatar && <Image style={ styles.imageIcon } source={ defaultAvatar }/> }
                <View style={ styles.certificationsCheckSubContainer }>
                  <Text style={ styles.textCertficationsTitle }>No one has checked in here yet</Text>
                  <Text style={ styles.textValue }>Be the first to check in and earn double points</Text>
                </View>
              </View>
            </View> 
          }
          { 
            this.state.everDidStatus && this.state.trendInit && (trendUsers.length > 0) &&
            <View style={ styles.certificationsContainer }>
              <View style={ styles.avatarsMainContainer }>
                <View style={ styles.names_timeContainer }>
                  <Text style={ styles.textName }>{ trendUsers[0].name } and {trendUserCount - 1} others</Text>
                  <Text style={ styles.textSmall }>Latest { UtilService.getPastDateTime(lastTrendTime) }</Text>
                </View>
                <View style={ styles.avatarsContainer }>
                  { this.getUsers(trendUsers) }
                  { business.trendActivityCount && business.activityCount > 6 && <View style={ styles.moreUserContainer }>
                    <Text style={ styles.textMoreUser }>+{ business.activityCount - 6 }</Text>
                  </View>}
                </View>
              </View>
              {/*<View style={ styles.like_coinContainer }>
                <Point point={ Number(business.points||1) }/>
              </View>*/}
            </View>
          }
          <View style={ styles.recentActivityContainer }>
            <View style={ styles.sectionTitleWrapper }>
              <Text style={ styles.textSectionTitle }>Comments</Text>
            </View>
            <View style={ styles.recentActivityListViewWrapper }>
              <ListView
                enableEmptySections={ true }
                dataSource={ this.dataSourceRecentActivity.cloneWithRows(this.state.comments) }
                renderRow={ this.renderRecentActivityRow.bind(this) }
              />
            </View>
          </View>
          <View style={ styles.ratingMainContainer }>
            { avatar && <Image style={ [styles.imageCategory, { backgroundColor:UtilService.getBackColor(avatar) }]} source={{ uri:avatar }} /> }
            { !avatar && defaultAvatar && <Image style={ styles.imageCategory } source={ defaultAvatar }/> }
            <View style={ styles.rating_commentContentContainer }>
              <View style={ styles.ratingContentContainer }>
                <Text style={ styles.textSectionTitle }>Tap stars to rate</Text>
                <Stars
                  isActive={ true }
                  rateMax={ 5 }
                  rate={ this.state.businessRate }
                  size={ 25 }
                  onStarPress={ (rating) => {
                    console.log(rating)
                    this.setState({ businessRate: rating })
                  }}
                />
              </View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={ false }
                multiline={ true }
                placeholder="Add a comment"
                placeholderTextColor={ commonColors.placeholderText }
                textAlign="left"
                style={ styles.input }
                underlineColorAndroid="transparent"
                returnKeyType={ 'done' }
                value={this.state.businessComment}
                onChangeText={ (text) => this.setState({ businessComment: text }) }
              />
            </View>
          </View>
          <View style={ styles.buttonRateBusinessWrapper }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onRateBusiness() }>
              <View style={ styles.buttonRateBusiness }>
                <Text style={ styles.textButton }>Rate Business</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
        { 
          !this.state.didStatus && <TouchableOpacity onPress={ () => this.onCheckIn() }>
            <View style={ styles.buttonCheckin }>
              <Text style={ styles.textButton }>I’m Here • Checkin</Text>
            </View>
          </TouchableOpacity>
        }
        {
          this.state.didStatus && <View style={ styles.buttonGrey }>
            <Text style={ styles.textOrange }>You’ve Checked In!</Text>
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
    actions: bindActionCreators(businessesDetailActions, dispatch)
  })
)(BusinessesDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',    
  },

  map: {
    flex: 1,
    height: commonStyles.hp(21),
  },
  mainContentContainer: {
    paddingLeft: 20,
    paddingRight: 16,
  },
  businessInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  businessInfoSubContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  businessInfoRatingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imageIcon: {
    width: 40,
    height: 40,
  },
  imageStar: {
    width: 16,
    height: 16,
    marginLeft: 3,
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
    paddingLeft: 10,
  },
  imageVisit: {
    height: 48,
    width: 48,
  },
  textOpenNow: {
    color: commonColors.detailTitle,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
  },
  openNowContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  openNowCellContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingRight: 15,
  },
  textDescription: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingVertical: 10,
  },
  textHeading: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    paddingVertical: 10,
  },
  certificationsContainer: {
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 5,
  },
  certificationsButtonContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonCertificationsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: commonColors.line,
    borderWidth: 5,
    borderStyle: 'solid',
    borderRadius: 5,
    marginRight: 5,
  },
  textCertificationsButton: {
    textAlign: 'center',
    backgroundColor: commonColors.line,
    color: commonColors.detailTitle,
    fontFamily: 'Open Sans',
    fontSize: 12,
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
  imageCategory: {
    width: 32,
    height: 32,
    borderRadius: 3,
  },
  textCertficationsTitle: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
  },
  certificationsCheckContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  certificationsCheckSubContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  recentActivityContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:20
  },
  recentActivityListViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },
  sectionTitleWrapper: {
    paddingBottom: 10,
    paddingLeft: 5,
  },
  textSectionTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
  },
  ratingMainContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 15,
  },
  rating_commentContentContainer: {
    flex: 1,
    paddingLeft: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  ratingContentContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 14,
    color: commonColors.title,
    height: 64,
    alignSelf: 'stretch',
    borderColor: '#efefef',
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 5,
  },
  buttonRateBusinessWrapper: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
    paddingRight: 15,
  },
  buttonRateBusiness: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.theme,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: commonColors.theme,
    borderStyle: 'solid',
    height: 32,
  },
  textButton: {
    color: '#fff',
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
  textOrange: {
    color: '#F59174',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  buttonGrey: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    height: 40,
  },
  avatarsMainContainer: {
    flex : 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  names_timeContainer: {
    flexDirection: 'row',
  },
  avatarsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  like_coinContainer: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  textName: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  textSmall: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
    paddingLeft: 5,
  },
  imageUserAvatar: {
    width: 32,
    height: 32,
  },
  moreUserContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#efefef',
  },
  textMoreUser: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLike: {
    width: 16,
    height: 15,
  },
});
