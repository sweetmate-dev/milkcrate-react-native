import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  SegmentedControlIOS,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import { SegmentedControls } from 'react-native-radio-buttons';

import SearchBar from './searchBar';
import SearchList from '../containers/searchList';
import SearchMap from '../containers/searchMap';

const { width, height } = Dimensions.get('window');

const back_arrow = require('../../../assets/imgs/back_arrow.png');
const filter = require('../../../assets/imgs/filter.png');

const stickerImages = [
  require('../../../assets/imgs/stickers/fashion1.png'),
  require('../../../assets/imgs/stickers/books.png'),
  require('../../../assets/imgs/stickers/business.png'),
  require('../../../assets/imgs/stickers/cleaning.png'),
  require('../../../assets/imgs/stickers/animals.png'),
  require('../../../assets/imgs/stickers/baby.png'),
  require('../../../assets/imgs/stickers/beauty.png'),
  require('../../../assets/imgs/stickers/bicycles.png'),
  require('../../../assets/imgs/stickers/civic.png'),
  require('../../../assets/imgs/stickers/coffee.png'),
  require('../../../assets/imgs/stickers/construction.png'),
  require('../../../assets/imgs/stickers/community.png'),
  require('../../../assets/imgs/stickers/dining.png'),
  require('../../../assets/imgs/stickers/drinks.png'),
  require('../../../assets/imgs/stickers/education.png'),
  require('../../../assets/imgs/stickers/energy.png'),
  require('../../../assets/imgs/stickers/fashion2.png'),
  require('../../../assets/imgs/stickers/finance.png'),
  require('../../../assets/imgs/stickers/food.png'),
  require('../../../assets/imgs/stickers/garden.png'),
  require('../../../assets/imgs/stickers/green_space.png'),
  require('../../../assets/imgs/stickers/health_wellness.png'),
  require('../../../assets/imgs/stickers/home.png'),
  require('../../../assets/imgs/stickers/media_communications.png'),
  require('../../../assets/imgs/stickers/special_events.png'),
  require('../../../assets/imgs/stickers/tourism_hospitality.png'),
  require('../../../assets/imgs/stickers/transit.png'),
  require('../../../assets/imgs/stickers/waste.png'),
  require('../../../assets/imgs/stickers/service.png'),
  require('../../../assets/imgs/stickers/vet.png'),
  require('../../../assets/imgs/stickers/groups.png'),
  require('../../../assets/imgs/stickers/wares.png'),
];

export default class SearchViewForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 'List',
    };
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

  render() {
    const { status } = this.props;
    const title = this.props.title;
    const  index = this.props.index;
    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
          <View style={ styles.buttonWrap }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onBack() }>
              <View style={ styles.button }>
                <Image source={ back_arrow } style={ styles.image }/>
              </View>
            </TouchableOpacity>
          </View>
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
          <View style={ styles.buttonWrap }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onFilter() }>
              <View style={ styles.button }>
                <Image source={ filter } style={ styles.image }/>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={ styles.segmentedWrap }>
          <View style={ styles.segmentedPadding }/>
          <View style={ styles.segmented }>
            <SegmentedControls
              tint={ '#fff' }
              selectedTint= { '#82ccbe' }
              backTint= { '#82ccbe' }
              options={ ['List', 'Map'] }
              allowFontScaling={ false } // default: true
              onSelection={ option => this.setState({ selectedIndex: option }) }
              selectedOption={ this.state.selectedIndex }
            />
          </View>
          <View style={ styles.segmentedPadding }/>
        </View>
        {
          this.state.selectedIndex == 'List' ?
          <SearchList title={ title } avatar={ stickerImages[index] } />
          :
          <SearchMap title={ title } avatar={ stickerImages[index] } />
        }
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
  background: {
    width,
    height,
  },
  buttonWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 14,
    height: 14,
    marginTop: 10,
  },
  segmentedWrap:{
    flexDirection: 'row',
    backgroundColor: '#82ccbe',
    height:44,
  },
  segmented:{
    flex : 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',

  },
  segmentedPadding:{
      flex : 1,
      backgroundColor: 'transparent',
  },
  tabStyle: {
    borderWidth: 1,
    borderColor: '#fff',
    borderStyle: 'solid',
    backgroundColor: '#82ccbe',
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
    color: '#82ccbe',
  },

});
