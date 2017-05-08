import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';

import SearchBar from './searchBar';
import { screenWidth } from '../styles/commonStyles';
import * as commonColors from '../styles/commonColors';
import * as commonStyles from '../styles/commonStyles';

const back_arrow = require('../../assets/imgs/back_arrow.png');
const filter = require('../../assets/imgs/filter.png');
const setting = require('../../assets/imgs/setting.png');

export default class NavSearchBar extends Component {

  static propTypes = {
    onSearchChange: PropTypes.func,
    onFocus: PropTypes.func,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    onBack: PropTypes.func,
    onFilter: PropTypes.func,
    onSetting: PropTypes.func,
    onGoSearchScreen: PropTypes.func,
    placeholder: PropTypes.string,
    buttons: PropTypes.number,
    searchAutoFocus: PropTypes.bool,
    searchMode: PropTypes.bool,
    query: PropTypes.string,
  }

  static defaultProps = {
    onSearchChange: () => {},
    onFocus: () => {},
    onClose: () => {},
    onCancel: () => {},
    onBack: () => {},
    onFilter: () => {},
    onSetting: () => {},
    onGoSearchScreen: () => {},
    placeholder: 'Search for activities',
    buttons: commonStyles.NavNoneButton,
    searchAutoFocus: false,
    searchMode: true,
    query: '',
  }

  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSetting = this.onSetting.bind(this);
    
    this.state= {
      isShowCancelButton: false,
    };
  }

  onSearchChange(text) {
    if (this.props.onSearchChange) {
      this.props.onSearchChange(text);
    }
  }
  
  onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
    this.setState({ 
      isShowCancelButton: true,
     });
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
    this.setState({ 
      isShowCancelButton: false,
    });
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

  onSetting() {
    if (this.props.onSetting) {
      this.props.onSetting();
    }
  }

  onGoSearchScreen() {
    if (this.props.onGoSearchScreen) {
      this.props.onGoSearchScreen();
    }
  }

  render() {
    const {
      placeholder,
      buttons,
      searchAutoFocus,
      searchMode,
      query,
    } = this.props;

    return (
      <View style={ styles.container }>

        <View style={ styles.navigationBarWrap }>
          {
            this.state.isShowCancelButton ?
              null
              :
              buttons & commonStyles.NavBackButton ?
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
              onSearchChange={ (text) => this.onSearchChange(text) }
              onFocus={ () => this.onFocus() }
              onClose={ () => this.onClose() }
              onGoSearchScreen={ () => this.onGoSearchScreen() }
              isCancel={ !this.state.isShowCancelButton }
              searchAutoFocus={ searchAutoFocus }
              searchMode={ searchMode }
              height={ 28 }
              query={ query }
              iconColor={ "#ffffff99" }
              placeholder = { placeholder }
              placeholderColor="#ffffff99"
            />
          </View>
          {
            this.state.isShowCancelButton ?
              <View style={ styles.cancelButtonWrap }>
                <TouchableOpacity onPress={ () => this.onCancel() }>
                  <Text style={ styles.textCancel }>Cancel</Text>
                </TouchableOpacity>
              </View>
              :
              buttons & commonStyles.NavFilterButton ?
                <View style={ styles.buttonWrap }>
                  <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onFilter() }>
                    <View style={ styles.button }>
                      <Image source={ filter } style={ styles.image }/>
                    </View>
                  </TouchableOpacity>
                </View>
                :
                buttons & commonStyles.NavSettingButton ?
                  <View style={ styles.buttonWrap }>
                    <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onSetting() }>
                      <View style={ styles.button }>
                        <Image source={ setting } style={ styles.image }/>
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
    height: (Platform.OS === 'android') ? 44 : 64,
    paddingTop: (Platform.OS === 'android') ? 8 : 28,
    paddingHorizontal: 10,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonWrap: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    height: 28,
  },

  button: {
    width: screenWidth * 0.12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 14,
    height: 14,
  },
  textCancel: {
    color: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
});