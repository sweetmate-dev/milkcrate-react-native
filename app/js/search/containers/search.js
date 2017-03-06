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

import { Actions } from 'react-native-router-flux';
import NavSearchBar from '../../components/navSearchBar';
import ImageButton from '../components/imageButton';
import CategoryButton from '../components/categoryButton';
import ExploreWaysListCell from '../components/exploreWaysListCell';
import { screenWidth, activityCellSize, categoryCellSize } from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const exploreWays = [
  {
    title: 'Recent',
    description: 'See your most recent activities',
    icon: require('../../../assets/imgs/recent.png'),
    iconWidth: 21,
    iconHeight: 21,
  },
  {
    title: 'Businesses',
    description: 'Earn points by checking in to certified business',
    icon: require('../../../assets/imgs/businesses.png'),
    iconWidth: 14,
    iconHeight: 21,
  },
  {
    title: 'Services',
    description: 'Signup for curated services to earn more points',
    icon: require('../../../assets/imgs/services.png'),
    iconWidth: 23,
    iconHeight: 20,
  },
  {
    title: 'Take Action',
    description: 'Earn points for actions you take',
    icon: require('../../../assets/imgs/actions.png'),
    iconWidth: 22,
    iconHeight: 22,
  },
  {
    title: 'Volunteer',
    description: 'Find volunteer opportunities and earn points ',
    icon: require('../../../assets/imgs/volunteer.png'),
    iconWidth: 26,
    iconHeight: 25,
  },
  {
    title: 'Events',
    description: 'Find great events to attend and earn more points',
    icon: require('../../../assets/imgs/events.png'),
    iconWidth: 23,
    iconHeight: 25,
  },
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

    var dataSourceExploreWays = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    var dataSourceCategories = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSourceExploreWays: dataSourceExploreWays.cloneWithRows(exploreWays),
      dataSourceCategories: dataSourceCategories.cloneWithRows(categoryImages),
    };
  }

  componentDidMount() {

    if (this.props.subOne != null) {

      let subOne = this.props.subOne;

      for (let i = 0 ; i < exploreWays.length ; i++) {
        if (exploreWays[i].title.toLowerCase() == subOne.toLocaleString()) {
          this.onSelectExploreWays ( i );
          return;
        }
      }

      for (let i = 0 ; i < categoryTitles.length ; i++) {
        if (categoryTitles[i].toLowerCase() == subOne.toLocaleString()) {
          this.onSelectCategory ( i );
          return;
        }
      }
    }
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onSelectExploreWays (index) {

    if (index == 1) {
      //Businesses
      Actions.BusinessesDetail();
      return;

    } else if (index == 5) {
      //Events
      Actions.Events();
      return;
     }

    alert("Clicked " + exploreWays[index].title);
    // Actions.SearchView();
  }

  onSelectCategory (rowID) {

    Actions.SearchView({ title:categoryTitles[rowID], index:rowID });
  }

  renderExploreWaysRow(rowData, sectionID, rowID) {
    return (
      <ExploreWaysListCell
        key={ rowID }
        title={ rowData.title }
        description={ rowData.description }
        icon={ rowData.icon }
        iconWidth={ rowData.iconWidth }
        iconHeight={ rowData.iconHeight }
        onClick={ () => this.onSelectExploreWays(rowID) }
      />
    );      
  }

  renderCategoriesRow(rowData, sectionID, rowID) {

    return (
      <View style={ styles.categoryCellWrap }>
        <View style={ styles.categoryCellButtonWrapper }>
          <ImageButton
            style={ styles.categoryCellImage }
            appearance={{
              normal: categoryImages[rowID],
              highlight: categoryActiveImages[rowID]
            }}
            onPress={ () => this.onSelectCategory(rowID) }
          />
          <Text style={ styles.cagegoryCellText }>
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
        <NavSearchBar/>
        <ScrollView>
          <Text style={ styles.textTitle }>Explore Ways to Earn Points</Text>
          <ListView
            dataSource={ this.state.dataSourceExploreWays }
            renderRow={ this.renderExploreWaysRow.bind(this) }
            contentContainerStyle={ styles.listViewExploreWays }
          />

          <Text style={ styles.textTitle }>Browse by Category</Text>

          <ListView
            pageSize = { categoryImages.length }
            dataSource={ this.state.dataSourceCategories }
            renderRow={ this.renderCategoriesRow.bind(this) }
            contentContainerStyle={ styles.listViewCategories }
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
  background: {
    width: screenWidth,
    height: screenWidth,
  },
  textTitle: {
    fontFamily: 'Open Sans',
    fontSize: 14,
    color: commonColors.grayMoreText,
    paddingTop: 24,
    paddingBottom: 8,
    paddingLeft: screenWidth * 0.05,
  },
  listViewCategories: {
    flexDirection:'row',
    flexWrap: 'wrap',
  },
  listViewExploreWays: {
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },
  categoryCellWrap: {
    padding: 10,
    width: categoryCellSize,
    height: categoryCellSize,
  },
  categoryCellButtonWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  categoryCellImage: {
    width: categoryCellSize - 40,
    height : categoryCellSize - 40,
  },
  cagegoryCellText: {
    width: categoryCellSize,
    height : categoryCellSize - 40,
    textAlign: 'center',
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
  },
});