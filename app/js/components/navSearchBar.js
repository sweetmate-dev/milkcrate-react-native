import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import SearchBar from './searchBar';
import { screenWidth } from '../styles/comonStyles';
import * as commonColors from '../styles/commonColors';

const back_arrow = require('../../assets/imgs/back_arrow.png');
const filter = require('../../assets/imgs/filter.png');

export default class NavSearchBar extends Component {

  static propTypes = {
    onSearchChange: PropTypes.func,
    onBack: PropTypes.func,
    onFilter: PropTypes.func,
    leftButton: PropTypes.bool,
    rightButton: PropTypes.bool,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    onSearchChange: () => {},
    onBack: () => {},
    onFilter: () => {},
    leftButton: false,
    rightButton: false,
    placeholder: 'Discover'
  }

  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  onSearchChange() {

    if (this.props.onSearchChange) {
      this.props.onSearchChange();
    }
  }

  onBack() {

    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  onFilter() {

    if (this.props.onFilter) {
      this.props.onFilter();
    }
  }

  render() {
    const {
      leftButton,
      rightButton,
      placeholder,
    } = this.props;

    return (
      <View style={ styles.container }>

        <View style={ styles.navigationBarWrap }>
          {
            leftButton ?
              <View style={ styles.buttonWrap }>
                <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onBack() }>
                  <View style={ styles.button }>
                    <Image source={ back_arrow } style={ styles.image }/>
                  </View>
                </TouchableOpacity>
              </View>
            :
              <View style={ styles.searchBarPadding }/>
          }
          <View style={ styles.searchBarWrap }>
            <SearchBar
              onSearchChange={ () => this.onSearchChange() }
              height={ 25 }
              autoCorrect={ false }
              returnKeyType={ "search" }
              iconColor={ "#ffffff99" }
              placeholder = { placeholder }
              placeholderColor="#ffffff99"
              paddingTop={ 20 }
            />
          </View>
          {
            rightButton ?
              <View style={ styles.buttonWrap }>
                <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onFilter() }>
                  <View style={ styles.button }>
                    <Image source={ filter } style={ styles.image }/>
                  </View>
                </TouchableOpacity>
              </View>
            :
              <View style={ styles.searchBarPadding }/>
          }
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
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
  buttonWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  button: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 14,
    height: 14,
    marginTop: 10,
  },
});