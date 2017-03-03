'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Home from '../../home/containers/home';
import Search from '../../search/containers/search';
import Notifications from '../../alert/containers/notifications';
import You from '../../you/containers/you';

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHiehgt } from '../../styles/comonStyles';

const homeIcon = require('../../../assets/imgs/tabbar_home.png');
const homeSelectedIcon = require('../../../assets/imgs/tabbar_home_selected.png');
const searchIcon = require('../../../assets/imgs/tabbar_search.png');
const searchSelectedIcon = require('../../../assets/imgs/tabbar_search_selected.png');
const alertIcon = require('../../../assets/imgs/tabbar_alert.png');
const alertSelectedIcon = require('../../../assets/imgs/tabbar_alert_selected.png');
const youIcon = require('../../../assets/imgs/tabbar_you.png');
const youSelectedIcon = require('../../../assets/imgs/tabbar_you_selected.png');

export default class Main extends Component {
  constructor(props) {
    super(props);

    let tab = this.props.tab;
    if (tab == null)
      tab = 'home';

    this.state = {
      selectedTab: tab,
      badge: 0,
    };

    StatusBar.setHidden(false);

    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', false);
    }
  }

  render() {
    const {status, subOne} = this.props;

    return (
      <View style={ styles.container }>
        <TabNavigator
          tabBarStyle = { styles.tab }
        >
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'home' }
            title="Home"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ homeIcon } style={ styles.iconTabbar1 }/> }
            renderSelectedIcon={ () => <Image source={ homeSelectedIcon } style={ styles.iconTabbar1 }/> }
            onPress={ () => this.setState({ selectedTab: 'home' }) }>
            <Home subOne = { subOne }/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'search' }
            title="Search"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ searchIcon } style={ styles.iconTabbar2 }/> }
            renderSelectedIcon={ () => <Image source={ searchSelectedIcon } style={ styles.iconTabbar2 }/> }
            onPress={ () => this.setState({ selectedTab: 'search' }) }>
            <Search subOne = { subOne }/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'alert' }
            title="Alert"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ alertIcon } style={ styles.iconTabbar3 }/> }
            renderSelectedIcon={ () => <Image source={ alertSelectedIcon } style={ styles.iconTabbar3 }/> }
            badgeText={ this.state.badge }
            onPress={ () => this.setState({ selectedTab: 'alert' }) }>
            <Notifications subOne = { subOne }/>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'you' }
            title="You"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ youIcon } style={ styles.iconTabbar4 }/> }
            renderSelectedIcon={ () => <Image source={ youSelectedIcon } style={ styles.iconTabbar4 }/> }
            onPress={ () => this.setState({selectedTab: 'you' }) }>
            <You subOne = { subOne }/>
          </TabNavigator.Item>
        </TabNavigator>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: screenWidth,
    height: screenHiehgt,
  },
  iconTabbar1: {
    width: 19,
    height: 15,
  },
  iconTabbar2: {
    width: 19,
    height: 19,
  },
  iconTabbar3: {
    width: 20,
    height: 21,
  },
  iconTabbar4: {
    width: 15,
    height: 18,
  },
  text: {
    fontFamily: 'Open Sans',
    fontSize: 10,
  },
  selectedText: {
    color: commonColors.theme,
    fontFamily: 'Open Sans',
    fontSize: 10,
  },
  tab: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.theme,
  },
});