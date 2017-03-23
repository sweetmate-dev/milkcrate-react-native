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
  {
    title: 'Recent',
    description: 'See your most recent activities',
    icon: require('../../../assets/imgs/recent.png'),
    iconWidth: 21,
    iconHeight: 21,
  },
  {
    title: 'Take Action',
    description: 'Explore easy, self-reported lifestyle behaviors',
    icon: require('../../../assets/imgs/actions.png'),
    iconWidth: 22,
    iconHeight: 22,
  },
  {
    title: 'Businesses',
    description: 'Check in to hundreds of local, sustainable businesses nearby',
    icon: require('../../../assets/imgs/businesses.png'),
    iconWidth: 14,
    iconHeight: 21,
  },
  {
    title: 'Events',
    description: 'Register for green events and add them to your calendar',
    icon: require('../../../assets/imgs/events.png'),
    iconWidth: 23,
    iconHeight: 25,
  },
  {
    title: 'Volunteer Opportunities',
    description: 'Find a local volunteer opportunity that’s right for you',
    icon: require('../../../assets/imgs/volunteer.png'),
    iconWidth: 26,
    iconHeight: 25,
  },
  {
    title: 'Services',
    description: 'Sign up for eco-friendly lifestyle services',
    icon: require('../../../assets/imgs/services.png'),
    iconWidth: 23,
    iconHeight: 20,
  },
];

const categoryTitles = [
  'Animas',
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
  require('../../../assets/imgs/categories/animals.png'),
  require('../../../assets/imgs/categories/baby.png'),
  require('../../../assets/imgs/categories/beauty.png'),
  require('../../../assets/imgs/categories/bicycles.png'),
  require('../../../assets/imgs/categories/civic.png'),
  require('../../../assets/imgs/categories/coffee.png'),
  require('../../../assets/imgs/categories/community.png'),
  require('../../../assets/imgs/categories/construction.png'),
  require('../../../assets/imgs/categories/dining.png'),
  require('../../../assets/imgs/categories/drinks.png'),
  require('../../../assets/imgs/categories/education.png'),
  require('../../../assets/imgs/categories/energy.png'),
  require('../../../assets/imgs/categories/fashion.png'),
  require('../../../assets/imgs/categories/finance.png'),
  require('../../../assets/imgs/categories/food.png'),
  require('../../../assets/imgs/categories/garden.png'),
  require('../../../assets/imgs/categories/green-space.png'),
  require('../../../assets/imgs/categories/health-wellness.png'),
  require('../../../assets/imgs/categories/home-office.png'),
  require('../../../assets/imgs/categories/media_communications.png'),
  require('../../../assets/imgs/categories/products.png'),
  require('../../../assets/imgs/categories/services.png'),
  require('../../../assets/imgs/categories/special-events.png'),
  require('../../../assets/imgs/categories/tourism_hospitality.png'),
  require('../../../assets/imgs/categories/transit.png'),
  require('../../../assets/imgs/categories/waste.png'),
];

const categoryActiveImages = [
  require('../../../assets/imgs/categories/animals_active.png'),
  require('../../../assets/imgs/categories/baby_active.png'),
  require('../../../assets/imgs/categories/beauty_active_active.png'),
  require('../../../assets/imgs/categories/bicycles_active.png'),
  require('../../../assets/imgs/categories/civic_active.png'),
  require('../../../assets/imgs/categories/coffee_active.png'),
  require('../../../assets/imgs/categories/community_active.png'),
  require('../../../assets/imgs/categories/construction_active.png'),
  require('../../../assets/imgs/categories/dining_active.png'),
  require('../../../assets/imgs/categories/drinks_active.png'),
  require('../../../assets/imgs/categories/education_active.png'),
  require('../../../assets/imgs/categories/energy_active.png'),
  require('../../../assets/imgs/categories/fashion_active.png'),
  require('../../../assets/imgs/categories/finance_active.png'),
  require('../../../assets/imgs/categories/food_active.png'),
  require('../../../assets/imgs/categories/garden_active.png'),
  require('../../../assets/imgs/categories/green-space_active.png'),
  require('../../../assets/imgs/categories/health-wellness_active.png'),
  require('../../../assets/imgs/categories/home-office_active.png'),
  require('../../../assets/imgs/categories/media_communications_active.png'),
  require('../../../assets/imgs/categories/products_active.png'),
  require('../../../assets/imgs/categories/services_active.png'),
  require('../../../assets/imgs/categories/special-events_active.png'),
  require('../../../assets/imgs/categories/tourism_hospitality_active.png'),
  require('../../../assets/imgs/categories/transit_active.png'),
  require('../../../assets/imgs/categories/waste_active.png'),
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

    switch (Number(index)) {
      case 0://Recent
        alert("Clicked " + exploreWays[index].title);
        break;

      case 1://Businesses
        Actions.BusinessesDetail();
        break;

      case 2://Services
        alert("Clicked " + exploreWays[index].title);
        break;

      case 3://Take Action
        Actions.ActionDetail();
        break;

      case 4://Volunteer
        alert("Clicked " + exploreWays[index].title);
        break;

      case 5://Events
        Actions.Events();
        break;

      default:

    }
  }

  onSelectCategory (rowID) {
    Actions.CategoryView({ title:categoryTitles[rowID], index:rowID });
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
    paddingTop: 8,
  },
});
