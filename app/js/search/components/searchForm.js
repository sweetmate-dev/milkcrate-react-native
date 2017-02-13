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

import {Actions} from 'react-native-router-flux';
import SearchBar from './searchBar';
import CategoryButton from './categoryButton';

const { width, height } = Dimensions.get('window');
const activityCellSize = width * 0.22;
const categoryCellSize = width * 0.2;

const recent = require('../../../assets/imgs/recent.png');
const businesses = require('../../../assets/imgs/businesses.png');
const services = require('../../../assets/imgs/services.png');
const actions = require('../../../assets/imgs/actions.png');
const volunteer = require('../../../assets/imgs/volunteer.png');
const events = require('../../../assets/imgs/events.png');
const categories_fashion = require('../../../assets/imgs/categories/fashion1.png');
const categories_books = require('../../../assets/imgs/categories/books.png');
const categories_business = require('../../../assets/imgs/categories/business.png');
const categories_cleaning = require('../../../assets/imgs/categories/cleaning.png');
const categories_animals = require('../../../assets/imgs/categories/animals.png');
const categories_baby = require('../../../assets/imgs/categories/baby.png');
const categories_beauty = require('../../../assets/imgs/categories/beauty.png');
const categories_bicycles = require('../../../assets/imgs/categories/bicycles.png');
const categories_civic = require('../../../assets/imgs/categories/civic.png');
const categories_coffee = require('../../../assets/imgs/categories/coffee.png');
const categories_construction = require('../../../assets/imgs/categories/construction.png');
const categories_community = require('../../../assets/imgs/categories/community.png');

export default class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedActivity: '',
      selectedCategory: '',
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onSelectActivity () {

    Actions.SearchView();
  }

  onSelectCategory () {

    Actions.SearchView();
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
          <View style={ styles.searchBarPadding }/>
          <View style={ styles.searchBarWrap }>
            <SearchBar
                onSearchChange={() => console.log('On Focus')}
                height={25}
                autoCorrect={ false }
                returnKeyType={ "search" }
                iconColor={ "#ffffff99" }
                placeholderColor="#ffffff99"
                paddingTop={20}
            />
          </View>
          <View style={ styles.searchBarPadding }/>
        </View>
        <ScrollView>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text="Recent" icon={ recent } onClickButton={ this.onSelectActivity }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text="Businesses" icon={ businesses } onClickButton={ this.onSelectActivity }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text="Services" icon={ services } onClickButton={ this.onSelectActivity }/>
          </View>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text="Actions" icon={ actions } onClickButton={ this.onSelectActivity }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text="Volenteer" icon={ volunteer } onClickButton={ this.onSelectActivity }/>
            <CategoryButton height={ activityCellSize } width={ activityCellSize } text="Events" icon={ events } onClickButton={ this.onSelectActivity }/>
          </View>
          <View style={ styles.line }/>
          <Text style={ styles.text }>Categories</Text>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Fashion" icon={ categories_fashion } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Books" icon={ categories_books } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Business" icon={ categories_business } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Cleaning" icon={ categories_cleaning } onClickButton={ this.onSelectCategory }/>
          </View>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Animals" icon={ categories_animals } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Baby" icon={ categories_baby } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Beauty" icon={ categories_beauty } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Bicycles" icon={ categories_bicycles } onClickButton={ this.onSelectCategory }/>
          </View>
          <View style={ styles.activityWrap }>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Civic" icon={ categories_civic } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Coffee" icon={ categories_coffee } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Construction" icon={ categories_construction } onClickButton={ this.onSelectCategory }/>
            <CategoryButton height={ categoryCellSize } width={ categoryCellSize } text="Community" icon={ categories_community } onClickButton={ this.onSelectCategory }/>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  navigationBarWrap:{
    flexDirection: 'row',
    backgroundColor: '#82ccbe',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#00000021',
    height:64,
  },
  searchBarWrap:{
    flex : 6,
    backgroundColor: 'transparent',
  },
  searchBarPadding: {
    flex: 1,
  },
  background: {
    width,
    height,
  },
  activityWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  line:{
    width,
    borderBottomWidth: 1,
    borderBottomColor: '#d4ebf6',
  },
  text: {
    color: '#a4a4a3',
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingVertical: 10,
    paddingLeft: width * 0.05,
  },
});