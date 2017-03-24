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
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as businessesDetailActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import Stars from 'react-native-stars-rating';
import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import BusinessRecentActivityListCell from '../components/businessRecentActivityListCell';

import { BusinessRecentActivityEntries } from '../../components/dummyEntries';

const dummyText = 'Luxury is something everyone deserves from time to time. Such an indulgence can make a vacation a truly rejuvenating experience. One of the best ways to get the luxury of the rich and famous to fit..';

const map_pin = require('../../../assets/imgs/map_marker.png');
const star = require('../../../assets/imgs/star.png');
const icon =   require('../../../assets/imgs/stickers/coffee.png');
const phone = require('../../../assets/imgs/phone.png');
const web = require('../../../assets/imgs/web.png');
const avatar = require('../../../assets/imgs/avatar.png');

const ASPECT_RATIO = commonStyles.screenHiehgt / commonStyles.screenHiehgt;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

//added by li, 2017/03/22
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'


class BusinessesDetail extends Component {
  constructor(props) {
    super(props);
    var dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      category:{
        coverImage:{
          _downloadURL:null
        }
      },
      initialize:false,
      didStatus:false,
      currentLocation:null,
      businessRate: 0,
      businessComment: '',
      dataSourceRecentActivity: dataSourceRecentActivity.cloneWithRows(BusinessRecentActivityEntries),
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

  componentDidMount(){
    const business = this.props.business
    console.log("business", business)
    bendService.checkActivityDid(business._id, 'business', (err, ret)=>{
      if(err) {
        console.log(err);return;
      }

      this.setState({
        didStatus:ret
      })
    })

    //console.log(action)
    if(business.categories&&business.categories.length >0) {
      bendService.getCategory(business.categories[0], (err, ret)=>{
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

  onFilter () {
    alert("Tapped filter button!");
  }

  onCallPhone() {
    alert("Tapped call button!");
  }

  onGoWeb() {
    alert("Tapped web button!");
  }

  onGetDirection() {
    alert("Tapped GetDirection button!");
  }

  onCertification(key) {
    alert("Tapped certification button!");
  }
  
  onRecentActivityCellPressed (rowID) {
    alert("Tapped cell - " + rowID);
  }

  onRateBusiness() {
    alert("Tapped RateBusiness button!");
  }

  onCheckin() {
    bendService.captureActivity(this.props.business._id, 'business', (err,ret)=>{
      if(err){
        console.log(err);return;
      }

      this.setState({
        didStatus:true
      })
    })
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {
    return (
      <BusinessRecentActivityListCell
        name={ rowData.name }
        description={ rowData.description }
        avatar={ rowData.avatar }
        time={ rowData.time }
        hearts={ rowData.hearts }
        rating={ rowData.rating }
        onClick={ () => this.onRecentActivityCellPressed(rowID) }
      />
    );
  }

  render() {
    const { status, business } = this.props;

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ={business.name}
        />
        <ScrollView>
          {this.state.currentLocation&&<MapView
            style={ styles.map }
            initialRegion={ {
        latitude: this.state.currentLocation.coords.latitude,
        longitude: this.state.currentLocation.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      } }
            scrollEnabled={ false }
            zoomEnabled={ false }
          >
            {
              <MapView.Marker
                image={ map_pin }
                coordinate={ this.state.currentLocation.coords}
              />
            }
          </MapView>}

          <View style={ styles.mainContentContainer }>
            <View style={ styles.businessInfoContainer }>
              <Image style={ styles.imageIcon } source={ UtilService.getCategoryImage(this.state.category.slug) } />
              <View style={ styles.businessInfoSubContainer }>
                <Text style={ styles.textTitle }>{business.name}</Text>
                {this.state.currentLocation&&<Text style={ styles.textValue }>
                  {business._geoloc?UtilService.getDistanceFromLatLonInMile(business._geoloc[0],business._geoloc[1],
                  this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude):'Unknown '}
                  Miles  $$</Text>}
              </View>
              <View style={ styles.businessInfoRatingContainer }>
                <Text style={ styles.textValue }>{ 4.8 } </Text>
                <Image style={ styles.imageStar } source={ star } />
              </View>
            </View>

            <View style={ styles.individualInfoContainer }>
              <View style={ styles.addressContainer }>
                <Text style={ styles.textAddress }>{business.address1}</Text>
                <Text style={ styles.textAddress }>{business.city}</Text>
                {false && <TouchableOpacity onPress={ () => this.onGetDirection() }>
                  <Text style={ styles.textTitle }>Get Directions</Text>
                </TouchableOpacity>}
              </View>
              <View style={ styles.visitContainer }>
                {business.phoneNumber != '' &&<TouchableOpacity onPress={ () => this.onCallPhone() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ phone } />
                    <Text style={ styles.textInfoTitle }>Phone</Text>
                  </View>
                </TouchableOpacity>}
                {business.url&&<TouchableOpacity onPress={ () => this.onGoWeb() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ web } />
                    <Text style={ styles.textInfoTitle }>Web</Text>
                  </View>
                </TouchableOpacity>}
              </View>
            </View>
            <Text style={ styles.textOpenNow }>Open Now</Text>
            <View style={ styles.openNowContentContainer }>
              <View style={ styles.openNowCellContainer }>
                <Text style={ styles.textInfoTitle }>Mon-Sat</Text>
                <Text style={ styles.textValue }>7am-8pm</Text>
              </View>
              <View style={ styles.openNowCellContainer }>
                <Text style={ styles.textInfoTitle }>Sun</Text>
                <Text style={ styles.textValue }>8am-7pm</Text>
              </View>
            </View>
            <Text style={ styles.textDescription }>{ business.description }</Text>
            {false&&<TouchableOpacity onPress={ () => this.onGetDirection() }>
              <Text style={ styles.textTitle }>See this listing on Foursqaure</Text>
            </TouchableOpacity>}
          </View>
          <View style={ styles.certificationsContainer }>
            <Text style={ styles.textDescription }>Certifications</Text>
            <View style={ styles.certificationsButtonContainer }>
              <TouchableOpacity onPress={ () => this.onCertification(0) }>
                <View style={ styles.buttonCertificationsWrapper }>
                  <Text style={ styles.textCertificationsButton }>Certified Organic</Text>
                </View>  
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => this.onCertification(1) }>
                <View style={ styles.buttonCertificationsWrapper }>
                  <Text style={ styles.textCertificationsButton }>Better Business Bureau</Text>
                </View>  
              </TouchableOpacity>
            </View>
            <View style={ styles.certificationsCheckContainer }>
              <Image style={ styles.imageAvatar } source={ avatar } />
              <View style={ styles.certificationsCheckSubContainer }>
                <Text style={ styles.textCertficationsTitle }>No one has checked in here yet</Text>
                <Text style={ styles.textValue }>Be the first to checkin and earn double points</Text>
              </View>
            </View>
          </View>
          {/*<View style={ styles.recentActivityContainer }>
            <View style={ styles.sectionTitleWrapper }>
              <Text style={ styles.textSectionTitle }>Comments</Text>
            </View>
            <View style={ styles.recentActivityListViewWrapper }>
              <ListView
                dataSource={ this.state.dataSourceRecentActivity }
                renderRow={ this.renderRecentActivityRow.bind(this) }/>
            </View>
          </View>
          <View style={ styles.ratingMainContainer }>
            <Image style={ styles.imageAvatar } source={ avatar } />
            <View style={ styles.rating_commentContentContainer }>
              <View style={ styles.ratingContentContainer }>
                <Text style={ styles.textSectionTitle }>Tap stars to rate</Text>
                <Stars
                  isActive={ true }
                  rateMax={ 5 }
                  rate={ this.state.businessRate }
                  size={ 25 }
                  onStarpress={ (rating) => this.setState({ businessRate: rating }) }
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
                onChangeText={ (text) => this.setState({ businessComment: text }) }
              />
            </View>            
          </View>*
          <View style={ styles.buttonRateBusinessWrapper }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onRateBusiness() }>
              <View style={ styles.buttonRateBusiness }>
                <Text style={ styles.textButton }>Rate Business</Text>
              </View>
            </TouchableOpacity>
          </View>*/}
        </ScrollView>
        {!this.state.didStatus&&<TouchableOpacity onPress={ () => this.onCheckin() }>
          <View style={ styles.buttonCheckin }>
            <Text style={ styles.textButton }>I’m Here • Checkin</Text>
          </View>
        </TouchableOpacity>}
        {this.state.didStatus&&<View style={ styles.buttonGrey }>
          <Text style={ styles.textOrange }>You’ve Checked In!</Text>
        </View>}
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
  map: {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(21),
  },
  map_pin: {
    width: 24,
    height: 37,
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
    paddingLeft: 5,
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
  certificationsContainer: {
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 5,
  },
  certificationsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',    
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
  imageAvatar: {
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
    paddingVertical: 40,
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
});