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
  ListView,
  TouchableOpacity,
  NetInfo,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

import {Actions} from 'react-native-router-flux';
import SearchBar from '../../components/searchBar';
import ImageButton from '../components/imageButton';
import CategoryButton from '../components/categoryButton';
import { screenWidth, activityCellSize, categoryCellSize } from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const recent = require('../../../assets/imgs/recent.png');
const businesses = require('../../../assets/imgs/businesses.png');
const services = require('../../../assets/imgs/services.png');
const actions = require('../../../assets/imgs/actions.png');
const volunteer = require('../../../assets/imgs/volunteer.png');
const events = require('../../../assets/imgs/events.png');

const activityTitles = [
  'Recent',
  'Businesses',
  'Services',
  'Actions',
  'Volunteer',
  'Events',
];

const categoryTitles = [
  'Fashion',
  'Books',
  'Business',
  'Cleaning',
  'Animals',
  'Baby',
  'Beauty',
  'Bicycles',
  'Civic',
  'Coffee',
  'Construction',
  'Community',
  'Dining',
  'Drinks',
  'Education',
  'Energy',
  'Fashion',
  'Finance',
  'Food',
  'Garden',
  'Green Space',
  'Health & Wellness',
  'Home',
  'Media & Communications',
  'Special Events',
  'Tourism & Hospitality',
  'Transit',
  'Waste',
  'Service',
  'Vet',
  'Groups',
  'Wares',
];

const categoryImages = [
  require('../../../assets/imgs/categories/fashion1.png'),
  require('../../../assets/imgs/categories/books.png'),
  require('../../../assets/imgs/categories/business.png'),
  require('../../../assets/imgs/categories/cleaning.png'),
  require('../../../assets/imgs/categories/animals.png'),
  require('../../../assets/imgs/categories/baby.png'),
  require('../../../assets/imgs/categories/beauty.png'),
  require('../../../assets/imgs/categories/bicycles.png'),
  require('../../../assets/imgs/categories/civic.png'),
  require('../../../assets/imgs/categories/coffee.png'),
  require('../../../assets/imgs/categories/construction.png'),
  require('../../../assets/imgs/categories/community.png'),
  require('../../../assets/imgs/categories/dining.png'),
  require('../../../assets/imgs/categories/drinks.png'),
  require('../../../assets/imgs/categories/education.png'),
  require('../../../assets/imgs/categories/energy.png'),
  require('../../../assets/imgs/categories/fashion2.png'),
  require('../../../assets/imgs/categories/finance.png'),
  require('../../../assets/imgs/categories/food.png'),
  require('../../../assets/imgs/categories/garden.png'),
  require('../../../assets/imgs/categories/green_space.png'),
  require('../../../assets/imgs/categories/health_wellness.png'),
  require('../../../assets/imgs/categories/home.png'),
  require('../../../assets/imgs/categories/media_communications.png'),
  require('../../../assets/imgs/categories/special_events.png'),
  require('../../../assets/imgs/categories/tourism_hospitality.png'),
  require('../../../assets/imgs/categories/transit.png'),
  require('../../../assets/imgs/categories/waste.png'),
  require('../../../assets/imgs/categories/service.png'),
  require('../../../assets/imgs/categories/vet.png'),
  require('../../../assets/imgs/categories/groups.png'),
  require('../../../assets/imgs/categories/wares.png'),
];

const categoryActiveImages = [
  require('../../../assets/imgs/categories/fashion1_active.png'),
  require('../../../assets/imgs/categories/books_active.png'),
  require('../../../assets/imgs/categories/business_active.png'),
  require('../../../assets/imgs/categories/cleaning_active.png'),
  require('../../../assets/imgs/categories/animals_active.png'),
  require('../../../assets/imgs/categories/baby_active.png'),
  require('../../../assets/imgs/categories/beauty_active.png'),
  require('../../../assets/imgs/categories/bicycles_active.png'),
  require('../../../assets/imgs/categories/civic_active.png'),
  require('../../../assets/imgs/categories/coffee_active.png'),
  require('../../../assets/imgs/categories/construction_active.png'),
  require('../../../assets/imgs/categories/community_active.png'),
  require('../../../assets/imgs/categories/dining_active.png'),
  require('../../../assets/imgs/categories/drinks_active.png'),
  require('../../../assets/imgs/categories/education_active.png'),
  require('../../../assets/imgs/categories/energy_active.png'),
  require('../../../assets/imgs/categories/fashion2_active.png'),
  require('../../../assets/imgs/categories/finance_active.png'),
  require('../../../assets/imgs/categories/food_active.png'),
  require('../../../assets/imgs/categories/garden_active.png'),
  require('../../../assets/imgs/categories/green_space_active.png'),
  require('../../../assets/imgs/categories/health_wellness_active.png'),
  require('../../../assets/imgs/categories/home_active.png'),
  require('../../../assets/imgs/categories/media_communications_active.png'),
  require('../../../assets/imgs/categories/special_events_active.png'),
  require('../../../assets/imgs/categories/tourism_hospitality_active.png'),
  require('../../../assets/imgs/categories/transit_active.png'),
  require('../../../assets/imgs/categories/waste_active.png'),
  require('../../../assets/imgs/categories/service_active.png'),
  require('../../../assets/imgs/categories/vet_active.png'),
  require('../../../assets/imgs/categories/groups_active.png'),
  require('../../../assets/imgs/categories/wares_active.png'),
];

class Search extends Component {
  constructor(props) {
    super(props);

    var dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: dataSource.cloneWithRows(categoryImages),
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onSelectActivity (index) {

    alert("Clicked " + activityTitles[index]);
    // Actions.SearchView();
  }

  onSelectCategory (rowID) {

    Actions.SearchView({ title:categoryTitles[rowID], index:rowID });
  }

  renderRow(rowData, sectionID, rowID) {

    return (
      <View style={ styles.cellWrap }>
        <View style={ styles.button }>
          <ImageButton
            style={ styles.cellImage }
            appearance={{
              normal: categoryImages[rowID],
              highlight: categoryActiveImages[rowID]
            }}
            onPress={ () => this.onSelectCategory(rowID) }
          />
          <Text style={ styles.cellText }>
            { categoryTitles[rowID] }
          </Text>
        </View>
      </View>
    );
  }


  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
          <View style={ styles.searchBarPadding }/>
          <View style={ styles.searchBarWrap }>
            <SearchBar
              onSearchChange={ () => console.log('On Focus') }
              height={ 25 }
              autoCorrect={ false }
              returnKeyType={ "search" }
              iconColor={ "#ffffff99" }
              placeholderColor="#ffffff99"
              paddingTop={ 20 }
            />
          </View>
          <View style={ styles.searchBarPadding }/>
        </View>
        <ScrollView>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text={ activityTitles[0] } icon={ recent } onClick={ () => this.onSelectActivity(0) }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text={ activityTitles[1] } icon={ businesses } onClick={ () => this.onSelectActivity(1) }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text={ activityTitles[2] } icon={ services } onClick={ () => this.onSelectActivity(2) }/>
          </View>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text={ activityTitles[3] } icon={ actions } onClick={ () => this.onSelectActivity(3) }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text={ activityTitles[4] } icon={ volunteer } onClick={ () => this.onSelectActivity(4) }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text={ activityTitles[5] } icon={ events } onClick={ () => this.onSelectActivity(5) }/>
          </View>
          <View style={ styles.line }/>
          <Text style={ styles.text }>Categories</Text>

          <ListView
            pageSize = { categoryImages.length }
            dataSource={ this.state.dataSource }
            renderRow={ this.renderRow.bind(this) }
            contentContainerStyle={ styles.list }
          />
        </ScrollView>
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
)(Search);


const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  navigationBarWrap: {
    flexDirection: 'row',
    backgroundColor: commonColors.theme,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#00000021',
    height: 64,
  },
  searchBarWrap: {
    flex : 6,
    backgroundColor: 'transparent',
  },
  searchBarPadding: {
    flex: 1,
  },
  background: {
    width: screenWidth,
    height: screenWidth,
  },
  activityWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  line: {
    width: screenWidth,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  text: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingVertical: 10,
    paddingLeft: screenWidth * 0.05,
  },
  list: {
    flexDirection:'row',
    flexWrap: 'wrap',
  },
  cellWrap: {
    padding: 10,
    width: categoryCellSize,
    height: categoryCellSize,
  },
  button: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cellImage: {
    width: categoryCellSize - 40,
    height : categoryCellSize - 40,
  },
  cellText: {
    width: categoryCellSize,
    height : categoryCellSize - 40,
    textAlign: 'center',
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
  },
});