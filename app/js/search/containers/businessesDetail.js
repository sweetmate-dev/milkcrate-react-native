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
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/comonStyles';
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

class BusinessesDetail extends Component {
  constructor(props) {
    super(props);
    var dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
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

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onPressPin () {

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
    alert("Tapped Checkin button!");
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
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          leftButton={ true }
          rightButton={ true }
          onBack={ this.onBack }
          onFilter={ this.onFilter }
          placeholder ='Discover Businesses'
        />
        <ScrollView>
          <MapView
            style={ styles.map }
            initialRegion={ this.state.region }
          >
            {
              <MapView.Marker
                image={ map_pin }
                coordinate={ this.state.coordinate }
                onPress={ () => this.onPressPin() }
              />
            }
          </MapView>

          <View style={ styles.mainContentContainer }>
            <View style={ styles.businessInfoContainer }>
              <Image style={ styles.imageIcon } source={ icon } />
              <View style={ styles.businessInfoSubContainer }>
                <Text style={ styles.textTitle }>Elixr Coffee Roasters</Text>
                <Text style={ styles.textValue }>{ 1.2 } Miles  { 10 } $$</Text>
              </View>
              <View style={ styles.businessInfoRatingContainer }>
                <Text style={ styles.textValue }>{ 4.8 } </Text>
                <Image style={ styles.imageStar } source={ star } />
              </View>
            </View>

            <View style={ styles.individualInfoContainer }>
              <View style={ styles.addressContainer }>
                <Text style={ styles.textAddress }>207 S Sydenham St</Text>
                <Text style={ styles.textAddress }>Philadelphia, PA</Text>
                <TouchableOpacity onPress={ () => this.onGetDirection() }>
                  <Text style={ styles.textTitle }>Get Directions</Text>
                </TouchableOpacity>
              </View>
              <View style={ styles.visitContainer }>
                <TouchableOpacity onPress={ () => this.onCallPhone() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ phone } />
                    <Text style={ styles.textInfoTitle }>Phone</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => this.onGoWeb() }>
                  <View style={ styles.visitCellContainer }>
                    <Image style={ styles.imageVisit } source={ web } />
                    <Text style={ styles.textInfoTitle }>Web</Text>
                  </View>
                </TouchableOpacity>  
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
            <Text style={ styles.textDescription }>{ dummyText }</Text>
            <TouchableOpacity onPress={ () => this.onGetDirection() }>
              <Text style={ styles.textTitle }>See this listing on Foursqaure</Text>
            </TouchableOpacity>
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
          <View style={ styles.recentActivityContainer }>
            <Text style={ styles.textRecentActivity }>Recent Activity</Text>
            <View style={ styles.recentActivityListViewWrapper }>
              <ListView
                dataSource={ this.state.dataSourceRecentActivity }
                renderRow={ this.renderRecentActivityRow.bind(this) }/>
            </View>
          </View>
          <View style={ styles.ratingMainContainer }>
            <Image style={ styles.imageAvatar } source={ avatar } />
            <View style={ styles.ratingContentContainer }>
              <Stars
                isActive={ true }
                rateMax={ 5 }
                rate={ this.state.businessRate }
                size={ 30 }
                onStarpress={ (rating) => this.setState({ businessRate: rating }) }
              />
              <TextInput
                autoCapitalize="none"
                autoCorrect={ false }
                placeholder="Add a comment"
                placeholderTextColor={ commonColors.placeholderText }
                textAlign="left"
                style={ styles.input }
                underlineColorAndroid="transparent"
                returnKeyType={ 'done' }
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
          <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onCheckin() }>
            <View style={ styles.buttonCheckin }>
              <Text style={ styles.textButton }>I’m Here • Checkin</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
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
    width: 10,
    height: 16,
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
    paddingHorizontal: 15,
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
  textRecentActivity: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingBottom: 10,
    paddingLeft: 5,
  },
  ratingMainContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 5,
    paddingRight: 15,    
  },
  ratingContentContainer: {
    flex: 1,
    paddingLeft: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    color: commonColors.title,
    height: 32,
    alignSelf: 'stretch',
    borderColor: '#efefef',
    backgroundColor: '#efefef',
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 5,
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
});