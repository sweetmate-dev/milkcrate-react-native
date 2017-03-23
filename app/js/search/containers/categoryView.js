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

import CategoryList from './categoryList';
import CategoryMap from './categoryMap';

import  * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const currentLocation = require('../../../assets/imgs/current_location_button.png');

//added by li, 2017/03/23
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'


const stickerImages = [
  require('../../../assets/imgs/stickers/animals.png'),
  require('../../../assets/imgs/stickers/baby.png'),
  require('../../../assets/imgs/stickers/beauty.png'),
  require('../../../assets/imgs/stickers/bicycles.png'),
  require('../../../assets/imgs/stickers/civic.png'),
  require('../../../assets/imgs/stickers/coffee.png'),
  require('../../../assets/imgs/stickers/community.png'),
  require('../../../assets/imgs/stickers/construction.png'),
  require('../../../assets/imgs/stickers/dining.png'),
  require('../../../assets/imgs/stickers/drinks.png'),
  require('../../../assets/imgs/stickers/education.png'),
  require('../../../assets/imgs/stickers/energy.png'),
  require('../../../assets/imgs/stickers/fashion.png'),
  require('../../../assets/imgs/stickers/finance.png'),
  require('../../../assets/imgs/stickers/food.png'),
  require('../../../assets/imgs/stickers/garden.png'),
  require('../../../assets/imgs/stickers/green-space.png'),
  require('../../../assets/imgs/stickers/health-wellness.png'),
  require('../../../assets/imgs/stickers/home-office.png'),
  require('../../../assets/imgs/stickers/media-communications.png'),
  require('../../../assets/imgs/stickers/products.png'),
  require('../../../assets/imgs/stickers/services.png'),
  require('../../../assets/imgs/stickers/special-events.png'),
  require('../../../assets/imgs/stickers/tourism-hospitality.png'),
  require('../../../assets/imgs/stickers/transit.png'),
  require('../../../assets/imgs/stickers/waste.png'),
];


class CategoryView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 'List',
      currentPosition: null,
      activities:[]
    };
  }

  componentDidMount() {
    const title = this.props.title;
    const  index = this.props.index;
    console.log("title, index", title, index)

    bendService.searchActivity({
      category:UtilService.convertToSlug(title),
      offset:0,
      limit:20
    }, (err, rets)=>{
      if(err) {
        console.log("search failed", err)
        return
      }
      this.setState({
        activities:rets
      })
    })
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

  render() {
    const { status } = this.props;
    const title = this.props.title;
    const  index = this.props.index;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          />
        <View style={ styles.segmentedWrap }>
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
        </View>
        {
          this.state.selectedIndex == 'List' ?
            <CategoryList title={ title } avatar={ stickerImages[index] } activities={this.state.activities}/>
            :
            <CategoryMap title={ title } avatar={ stickerImages[index] } currentLocation={ this.state.currentPosition } />
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
)(CategoryView);

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
