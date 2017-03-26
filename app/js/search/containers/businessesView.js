'use strict';

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

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import { SegmentedControls } from 'react-native-radio-buttons';

import NavSearchBar from '../../components/navSearchBar';

import BusinessesListView from './businessesListView';
import BusinessesMapView from './businessesMapView';

import  * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const currentLocation = require('../../../assets/imgs/current_location_button.png');

//added by li, 2017/03/23
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'


class BusinessesView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 'List',
      currentPosition: null,
      businesses: [],
      categoryIcons: [],

      businessesQuery:{
        offset: 0,
        limit: 20,
        more: true,
        loading: false,
        search: '',
      },
    };
  }

  componentDidMount() {

    this.loadBusinesses();
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onBack() {
    Actions.pop()
  }

  onFilter() {
    alert("Tapped filter button!");
  }

  onCurrentLocation() {
    navigator.geolocation.getCurrentPosition( (position) => {
        this.setState({ currentPosition: position });
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  loadBusinesses() {

    if (this.state.businessesQuery.more === false)
      return;

    this.setState( (state) => {  
      state.businessesQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentPosition: position })

        bendService.searchActivity({
          type:'business',
          offset: this.state.businessesQuery.offset,
          limit: this.state.businessesQuery.limit,
          query: this.state.businessesQuery.search,
          lat: position.coords.latitude,
          long: position.coords.longitude
        }, (error, result)=>{

          this.setState( (state) => {  
            state.businessesQuery.loading = false;
            return state;
          });

          if (error) {
            console.log("search failed", error)
            return
          }

          let moreBusinesses = true;
          if (result.data.business.length < this.state.businessesQuery.limit) {
            moreBusinesses = false;
          }

          const imageOffset = this.state.businessesQuery.offset;

          this.setState( (state) => {
            state.businesses = this.state.businesses.concat(result.data.business);
            state.businessesQuery.offset += this.state.businessesQuery.limit;
            state.businessesQuery.more = moreBusinesses;
            return state;
          })

          result.data.business.map( (business, index) => {
            if (business.categories && business.categories.length > 0) {
              bendService.getCategory(business.categories[0], (error, result)=>{

                if (error){
                  console.log(error);
                  return
                }

                this.setState( (state) => {
                  state.categoryIcons[imageOffset + index] = UtilService.getCategoryIcon(result.slug);;
                  return state;
                })
              })
            }
          });
        })
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  onSearchChange(text) {

    this.setState( (state) => {
      state.businessesQuery.offset = 0;
      state.businessesQuery.more = true;
      state.businessesQuery.search = text;
      state.businesses = [];
      state.categoryIcons = [];
      return state;
    })

    this.loadBusinesses();
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          placeholder={ 'Search businesses' }
          onSearchChange={ (text) => this.onSearchChange(text) }
        />
        {/*<View style={ styles.segmentedWrap }>
          <View style={ styles.segmentedLeft }/>
          <View style={ styles.segmented }>
            <SegmentedControls
              tint={ '#fff' }
              selectedTint= { commonColors.theme }
              backTint= { commonColors.theme }
              options={ ['List', 'Map'] }
              allowFontScaling={ false } // default: true
              onSelection={ option => this.setState({ selectedIndex: option }) }
              selectedOption={ this.state.selectedIndex }
            />
          </View>
          <View style={ styles.segmentedRight }>
            {
              this.state.selectedIndex == 'Map' ?
                <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onCurrentLocation() }>
                  <Image style={ styles.imageCurrentLocation } source={ currentLocation }/>
                </TouchableOpacity>
              :
                null
            }
          </View>
        </View>*/}
        {
          this.state.selectedIndex == 'List' ?
            <BusinessesListView 
              businesses={ this.state.businesses } 
              categoryIcons={ this.state.categoryIcons } 
              currentLocation={ this.state.currentPosition } 
              moreBusinesses={ this.state.businessesQuery.more }
              loading={ this.state.businessesQuery.loading }
              onLoadBusinesses={ () => this.loadBusinesses() }
            />
            :
            <BusinessesMapView 
              categoryIcon={ commonStyles.categoryIcons[0] } 
              businesses={ this.state.businesses } 
              currentLocation={ this.state.currentPosition } 
            />
        }
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
)(BusinessesView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: commonStyles.screenWidth,
    height: commonStyles.screenHiehgt,
  },
  segmentedWrap: {
    flexDirection: 'row',
    backgroundColor: commonColors.theme,
    height: 44,
  },
  segmented: {
    flex: 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedLeft: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  segmentedRight: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCurrentLocation: {
    width: 20,
    height: 22,
  },
  tabStyle: {
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'solid',
    backgroundColor: commonColors.theme,
  },
  tabTextStyle: {
    color: '#fff',
  },
  activeTabStyle: {
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'solid',
    backgroundColor: '#fff',
  },
  activeTabTextStyle: {
    color: commonColors.theme,
  },
});
