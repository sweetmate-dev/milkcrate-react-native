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
import Permissions from 'react-native-permissions';
import Home from '../../home/containers/home';
import Search from '../../search/containers/search';
import Notifications from '../../alert/containers/notifications';
import Profile from '../../profile/containers/profile';


import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

const homeIcon = require('../../../assets/imgs/tabbar_home.png');
const homeSelectedIcon = require('../../../assets/imgs/tabbar_home_selected.png');
const searchIcon = require('../../../assets/imgs/tabbar_search.png');
const searchSelectedIcon = require('../../../assets/imgs/tabbar_search_selected.png');
const alertIcon = require('../../../assets/imgs/tabbar_alert.png');
const alertIconRed = require('../../../assets/imgs/icon-alert-red.png');
const alertSelectedIcon = require('../../../assets/imgs/tabbar_alert_selected.png');
const youIcon = require('../../../assets/imgs/tabbar_you.png');
const youSelectedIcon = require('../../../assets/imgs/tabbar_you_selected.png');

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

export default class Main extends Component {
  constructor(props) {
    super(props);

    let tab = this.props.tab;
    if (tab == null)
      tab = 'home';

    this.state = {
      selectedTab: tab,
      badge: 0,
      searchAutoFocus: false,
      alerts:[],
      lastAlertTime:0,
      hasNewAlert:false
    };

    StatusBar.setHidden(false);

    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', false);
    } else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(commonColors.theme, false);
    }
  }

  componentDidMount() {
    this.hasMounted = true
    if (Platform.OS === 'ios') {
      Permissions.requestPermission('notification')
          .then(response => {
            console.log(response)
          });

    } 
    if (Platform.OS === 'ios') {
      navigator.geolocation.getCurrentPosition( (position) => {
          console.log(JSON.stringify(position));
        },
        (error) => {
          console.log(JSON.stringify(error));
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      Permissions.requestPermission('location', 'always')
        .then(response => {
          this.hasMounted&&this.setState({ photoPermission: response })
        });
    }

    this.loadAlerts()
  }
  componentWillUnmount() {
    this.hasMounted = false
  }

  loadAlerts() {
    //first load alerts
    bendService.getUserAlerts( (error, result)=>{
      if (error) {
        console.log(error);
        return;
      }

      if (result.length > 0) {
        this.hasMounted&&this.setState({
          alerts: result,
          lastAlertTime:result[0]._bmd.createdAt
        })
      }
    })

    var intervalHandler = setInterval(()=>{
      if(!this.hasMounted) {
        clearInterval(intervalHandler);
        return;
      }
      if (bendService.getActiveUser()) {
        bendService.getLastAlerts(this.state.lastAlertTime, (error, result) => {
          if (error) {
            console.log(error);
            return;
          }

          if (result.length > 0) {
            this.state.alerts = result.concat(this.state.alerts)
            this.hasMounted && this.setState({
              alerts: this.state.alerts,
              lastAlertTime: result[0]._bmd.createdAt,
              hasNewAlert:true
            })
          }
        })
      }
    }, 3000)
  }

  onSelectSearch() {
    this.hasMounted&&this.setState({
      selectedTab: 'search',
      searchAutoFocus: true,
    });
  }

  onSelectTab( tab ) {
    this.hasMounted&&this.setState({
      selectedTab: tab,
    });

    if(tab == 'alerts') {
      this.hasMounted&&this.setState({
        hasNewAlert:false
      });
    }
  }

  render() {
    const { 
      subOne,
    } = this.props;

    return (
      <View style={ styles.container }>
        <TabNavigator
          tabBarStyle = { styles.tab }
        >
          {/* Home */}
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'home' }
            title="Home"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ homeIcon } style={ styles.iconTabbar1 }/> }
            renderSelectedIcon={ () => <Image source={ homeSelectedIcon } style={ styles.iconTabbar1 }/> }
            onPress={ () => this.onSelectTab('home') }>
            <Home
              selectedTab={this.state.selectedTab}
              subOne={ subOne } 
              onSearch={ () => this.onSelectSearch() }
            />
          </TabNavigator.Item>

          {/* Search */}
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'search' }
            title="Search"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ searchIcon } style={ styles.iconTabbar2 }/> }
            renderSelectedIcon={ () => <Image source={ searchSelectedIcon } style={ styles.iconTabbar2 }/> }
            onPress={ () => this.onSelectTab('search') }>
            <Search
              selectedTab={this.state.selectedTab}
              subOne={ subOne }
              searchAutoFocus={ this.state.searchAutoFocus }
            />
          </TabNavigator.Item>

          {/* Alerta */}
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'alerts' }
            title="Alerts"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ this.state.hasNewAlert?alertIconRed:alertIcon } style={ this.state.hasNewAlert?styles.iconTabbar3_2:styles.iconTabbar3 } resizeMode="contain"/> }
            renderSelectedIcon={ () => <Image source={ alertSelectedIcon } style={ styles.iconTabbar3 }/> }
            badgeText={ this.state.badge }
            onPress={ () => this.onSelectTab('alerts') }>
            <Notifications 
              subOne={ subOne }
              alerts={ this.state.alerts }
              onSearch={ () => this.onSelectSearch() }
            />
          </TabNavigator.Item>
          
          {/* You */}
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'profile' }
            title="Profile"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ youIcon } style={ styles.iconTabbar4 }/> }
            renderSelectedIcon={ () => <Image source={ youSelectedIcon } style={ styles.iconTabbar4 }/> }
            onPress={ () => this.onSelectTab('profile') }>
            <Profile
              subOne={ subOne }
              selectedTab={ this.state.selectedTab }
              onSearch={ () => this.onSelectSearch() }
            />
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
  iconTabbar3_2: {
    width: 20,
    height: 24,
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