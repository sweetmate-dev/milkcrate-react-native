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

import { screenWidth } from '../styles/commonStyles';
import * as commonColors from '../styles/commonColors';
import * as commonStyles from '../styles/commonStyles';

const back_arrow = require('../../assets/imgs/back_arrow.png');
const filter = require('../../assets/imgs/filter.png');
const setting = require('../../assets/imgs/setting.png');

export default class NavTitleBar extends Component {

  static propTypes = {
    onBack: PropTypes.func,
    onFilter: PropTypes.func,
    onSetting: PropTypes.func,
    title: PropTypes.string,
    buttons: PropTypes.number,    
  }

  static defaultProps = {
    onBack: () => {},
    onFilter: () => {},
    onSetting: () => {},
    title: 'Title',
    buttons: commonStyles.NavNoneButton,
  }

  constructor(props) {
    super(props);
    this.onBack = this.onBack.bind(this);
    this.onFilter = this.onFilter.bind(this);
    this.onSetting = this.onSetting.bind(this);
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

  render() {
    const {
      title,
      buttons,
    } = this.props;

    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
          {
            buttons & commonStyles.NavBackButton ?
              <View style={ styles.buttonWrap }>
                <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onBack() }>
                  <View style={ styles.button }>
                    <Image source={ back_arrow } style={ styles.image }/>
                  </View>
                </TouchableOpacity>
              </View>
            :
              <View style={ styles.titleBarPadding }/>
          }
          <View style={ styles.titleBarWrap }>
            <Text numberOfLines={ 1 } style={ styles.textTitle }>{ title }</Text>
          </View>
          {
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
                <View style={ styles.titleBarPadding }/>
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
    paddingTop: (Platform.OS === 'android') ? 0 : 20,
  },
  titleBarWrap: {
    flex : 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBarPadding: {
    flex: 1,
  },
  textTitle: {
    color: '#fff',
    fontFamily: 'Blanch',
    fontSize: 28,
    textAlign: 'center',
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
  },
});