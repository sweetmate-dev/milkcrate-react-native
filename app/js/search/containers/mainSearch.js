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
import { screenWidth, activityCellSize, categoryCellSize } from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const exploreWays = [
  // {
  //   title: 'Recent',
  //   description: 'See your most recent activities',
  //   icon: require('../../../assets/imgs/recent.png'),
  //   iconWidth: 21,
  //   iconHeight: 21,
  // },
  {
    title: 'Take Action',
    description: 'Explore easy, self-reported lifestyle behaviors',
    icon: require('../../../assets/imgs/actions.png'),
    iconWidth: 22,
    iconHeight: 22,
  },
  {
    title: 'Businesses',
    description: 'Check in to local, sustainable businesses nearby',
    icon: require('../../../assets/imgs/businesses.png'),
    iconWidth: 14,
    iconHeight: 21,
  },
  {
     title: 'Events',
     description: 'Register for green events and add to your calendar',
     icon: require('../../../assets/imgs/events.png'),
     iconWidth: 23,
     iconHeight: 25,
   },
  // {
  //   title: 'Volunteer Opportunities',
  //   description: 'Find one that’s right for you',
  //   icon: require('../../../assets/imgs/volunteer.png'),
  //   iconWidth: 26,
  //   iconHeight: 25,
  // },
  // {
  //   title: 'Services',
  //   description: 'Sign up for eco-friendly lifestyle services',
  //   icon: require('../../../assets/imgs/services.png'),
  //   iconWidth: 23,
  //   iconHeight: 20,
  // },

];

const categoryTitles = [
  'Animals',
  'Baby',
  'Beauty',
  'Bicycles',
  'Civic',
  'Coffee',
  'Community',
  'Construction',
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
  'Home & Office',
  'Media & Communications',
  'Products',
  'Services',
  'Special Events',
  'Tourism & Hospitality',
  'Transit',
  'Waste'
];

const categoryImages = [
  require('../../../assets/imgs/category-buttons/animals.png'),
  require('../../../assets/imgs/category-buttons/baby.png'),
  require('../../../assets/imgs/category-buttons/beauty.png'),
  require('../../../assets/imgs/category-buttons/bicycles.png'),
  require('../../../assets/imgs/category-buttons/civic.png'),
  require('../../../assets/imgs/category-buttons/coffee.png'),
  require('../../../assets/imgs/category-buttons/community.png'),
  require('../../../assets/imgs/category-buttons/construction.png'),
  require('../../../assets/imgs/category-buttons/dining.png'),
  require('../../../assets/imgs/category-buttons/drinks.png'),
  require('../../../assets/imgs/category-buttons/education.png'),
  require('../../../assets/imgs/category-buttons/energy.png'),
  require('../../../assets/imgs/category-buttons/fashion.png'),
  require('../../../assets/imgs/category-buttons/finance.png'),
  require('../../../assets/imgs/category-buttons/food.png'),
  require('../../../assets/imgs/category-buttons/garden.png'),
  require('../../../assets/imgs/category-buttons/green-space.png'),
  require('../../../assets/imgs/category-buttons/health-wellness.png'),
  require('../../../assets/imgs/category-buttons/home-office.png'),
  require('../../../assets/imgs/category-buttons/media-communications.png'),
  require('../../../assets/imgs/category-buttons/products.png'),
  require('../../../assets/imgs/category-buttons/services.png'),
  require('../../../assets/imgs/category-buttons/special-events.png'),
  require('../../../assets/imgs/category-buttons/tourism-hospitality.png'),
  require('../../../assets/imgs/category-buttons/transit.png'),
  require('../../../assets/imgs/category-buttons/waste.png'),
];

const categoryActiveImages = [
  require('../../../assets/imgs/category-buttons/animals_active.png'),
  require('../../../assets/imgs/category-buttons/baby_active.png'),
  require('../../../assets/imgs/category-buttons/beauty_active.png'),
  require('../../../assets/imgs/category-buttons/bicycles_active.png'),
  require('../../../assets/imgs/category-buttons/civic_active.png'),
  require('../../../assets/imgs/category-buttons/coffee_active.png'),
  require('../../../assets/imgs/category-buttons/community_active.png'),
  require('../../../assets/imgs/category-buttons/construction_active.png'),
  require('../../../assets/imgs/category-buttons/dining_active.png'),
  require('../../../assets/imgs/category-buttons/drinks_active.png'),
  require('../../../assets/imgs/category-buttons/education_active.png'),
  require('../../../assets/imgs/category-buttons/energy_active.png'),
  require('../../../assets/imgs/category-buttons/fashion_active.png'),
  require('../../../assets/imgs/category-buttons/finance_active.png'),
  require('../../../assets/imgs/category-buttons/food_active.png'),
  require('../../../assets/imgs/category-buttons/garden_active.png'),
  require('../../../assets/imgs/category-buttons/green-space_active.png'),
  require('../../../assets/imgs/category-buttons/health-wellness_active.png'),
  require('../../../assets/imgs/category-buttons/home-office_active.png'),
  require('../../../assets/imgs/category-buttons/media-communications_active.png'),
  require('../../../assets/imgs/category-buttons/products_active.png'),
  require('../../../assets/imgs/category-buttons/services_active.png'),
  require('../../../assets/imgs/category-buttons/special-events_active.png'),
  require('../../../assets/imgs/category-buttons/tourism-hospitality_active.png'),
  require('../../../assets/imgs/category-buttons/transit_active.png'),
  require('../../../assets/imgs/category-buttons/waste_active.png'),
];


class MainSearch extends Component {
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

    switch (Number(index)) {
      // case 0://Recent
      //   alert("Clicked " + exploreWays[index].title);
      //   break;

      case 0://Take Action
        Actions.ActionView();
        break;

      case 1://Businesses
        Actions.BusinessesView();
        break;

      case 2://Events
        Actions.EventsView();
        break;

      // case 4://Volunteer
      //   alert("Clicked " + exploreWays[index].title);
      //   break;

      case 1://Services
        alert("Clicked " + exploreWays[index].title);
        break;

      default:

    }
  }

  onSelectCategory (rowID) {
    Actions.CategoryView({ title: categoryTitles[rowID], index: rowID });
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
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(MainSearch);

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  textTitle: {
    fontFamily: 'OpenSans-Semibold',
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
    height: categoryCellSize * 1.1,
  },
  categoryCellButtonWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  categoryCellImage: {
    // width: categoryCellSize - 40,
    // height : categoryCellSize - 40,
    width: 60,
    height: 60,
  },
  cagegoryCellText: {
    width: categoryCellSize,
    height : categoryCellSize - 40,
    textAlign: 'center',
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 11,
    paddingTop: 8,
  },
});
