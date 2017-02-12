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

  setSelectedOption(selectedOption){
    this.setState({
      selectedIndex:selectedOption
    });
  }

    render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
          <View style={ styles.button }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onBack() }>
              <Image source={ back_arrow } style={ styles.image }/>
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
          <View style={ styles.button }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onFilter() }>
              <Image source={ filter } style={ styles.image }/>
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
          <SearchList/>
          :
          <SearchMap/>
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
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 15,
  },
  image: {
    width: 14,
    height: 14,
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
