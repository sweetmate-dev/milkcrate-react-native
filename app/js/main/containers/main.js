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
  AsyncStorage,
  Linking,
  Alert,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';
import Permissions from 'react-native-permissions';
import Home from '../../home/containers/home';
import Search from '../../search/containers/search';
import Notifications from '../../alert/containers/notifications';
import Profile from '../../profile/containers/profile';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation';
import Spinner from 'react-native-loading-spinner-overlay';

import { Actions } from 'react-native-router-flux';

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHeight } from '../../styles/commonStyles';

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
import PushNotification from 'react-native-push-notification';
import DeepLinking from 'react-native-deep-linking';

export default class Main extends Component {
  constructor(props) {
    super(props);

    let tab = this.props.tab;
    console.log('main - tab : ', tab)
    if ((tab == null) || (tab == 'modal')) {
      tab = 'home';
    }
    
    this.state = {
      selectedTab: tab,
      badge: 0,
      searchAutoFocus: false,
      alerts: [],
      lastAlertTime: 0,
      hasNewAlert: false,
      showingModal: false,
    };

    this.last = null;

    StatusBar.setHidden(false);

    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content', false);
    } else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(commonColors.theme, false);
    }
  }

  componentDidMount() {
    if (this.props.tab === 'modal') {
      this.showActivityDetailModal();
    }
    
    this.hasMounted = true

    Orientation.unlockAllOrientations();

    let activeUser = bendService.getActiveUser();
    if(!activeUser.name) {
      Actions.SetupProfile()
    }
    
    /*
    if (Platform.OS === 'ios') {

      PushNotificationIOS.addEventListener('register', (token)=>{
          this.saveInstallationInfo(activeUser, token)

      });
      PushNotificationIOS.addEventListener('registrationError', ()=>{
          this.saveInstallationInfo(activeUser, null)
      });
      PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
      PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

      PushNotificationIOS.requestPermissions();
    } else if (Platform.OS === 'android') {

    }
    */

    setTimeout(()=>{
      Permissions.requestPermission('location', 'always')
          .then(response => {
            console.log(JSON.stringify(response));
          });

      PushNotification.configure({

        // (optional) Called when Token is generated (iOS and Android)
        onRegister: (token)=> {
          console.log("Token:", token)
          this.saveInstallationInfo(activeUser, (token ? token.token : null))
        },

        // (required) Called when a remote or local notification is opened or received
        onNotification: (notification)=> {
          this._onRemoteNotification(notification)
        },

        // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
        senderID: "887728351696", //"1491633624875",

        // IOS ONLY (optional): default: all - Permissions to register.
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         */
        requestPermissions: true,
      });
    }, 1000)

    this.loadAlerts()
  }

  componentWillUnmount() {
    this.hasMounted = false
  }
  
  componentWillReceiveProps(nextProps){    
    
    // console.log( 'main - componentWillReceiveProps');

    // if (nextProps.tab != this.state.selectedTab) {
    //   this.setState({ selectedTab: tab });
    // }
  }

  _onRemoteNotification(notification) {
    console.log("notification", notification)

    var url;

    if(Platform.OS == 'ios') {
      url = notification.data.deeplink;
    } else {
      url = notification.deeplink;
    }

    if(notification.foreground) {
      //in-use
      if(url) {
        Alert.alert(
            notification.data.title,
            notification.message,
            [
              {text: notification.data.cancelButton||'Dismiss', onPress: () => {
                console.log("Canceled")
              }},
              {text: notification.data.actionButton||'View Now', onPress: () => {
                Linking.openURL(url.toLowerCase())
              }},
            ]
        )
      } else {
        Alert.alert(
            notification.data.title,
            notification.message
        )
      }
    } else {
      //background notification

      if(url)
        Linking.openURL(url.toLowerCase())
    }
  }

  _onLocalNotification(notification){

  }

  saveInstallationInfo(activeUser, token) {
    /*
      - appVersion
      - bundleId (this is the package name for  android)
      - user – if a user is logged in
      - deviceName  – "Kostas' iPhone"
      - deviceModel – "iPhone"
      - deviceVersion – "iPhone7,2"
      - systemName – the OS ("iOS")
      - systemVersion – the OS version
      - deviceId – the vendorID on iOS, unique device id on android
      - buildType – "release" or "development" or "staging"
      - apnsToken – iOS only, the push token
      - gcmRegistrationId – Android only, the android push token
    */

    AsyncStorage.getItem('milkcrate-installation-info', (err, ret)=>{
      var installInfo = ret
      //console.log("installationInfo", installInfo)
      if (installInfo) {
        installInfo = JSON.parse(installInfo)
      } else {
        installInfo = {}
      }
      _.extend(installInfo, {
        appVersion: DeviceInfo.getVersion(),
        bundleId: DeviceInfo.getBundleId(),
        user: activeUser ? {
          "_type": "BendRef",
          "_id": activeUser._id,
          "_collection": "user"
        } : null,
        deviceName: DeviceInfo.getDeviceName(),
        deviceModel: DeviceInfo.getModel(),
        deviceVersion: DeviceInfo.getDeviceId(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
        deviceId: DeviceInfo.getUniqueID(),
        buildType: (__DEV__ ? "development" : "production"),
      })

      if (token) {
        if (Platform.OS == 'ios') {
          installInfo.apnsToken = token
        } else {
          installInfo.gcmRegistrationId = token
        }
      }

      bendService.saveInstallInformation(installInfo, (error, ret)=>{
        if (!error) {
          AsyncStorage.setItem('milkcrate-installation-info', JSON.stringify(ret.result));
        }
      })

      BackgroundGeolocation.configure({
        desiredAccuracy: 10,
        stationaryRadius: 50,
        distanceFilter: 50,
        debug: false,
        stopOnTerminate: false,
        startForeground: false,
        interval: 10000
      }, function () {});

      BackgroundGeolocation.on('location', (location) => {
        if (this.last) {
          if (this.last.latitude == location.latitude && this.last.longitude == location.longitude) {
            return;
          }
        }

        this.last = location;
        console.log('[DEBUG] BackgroundGeolocation location', location);

        //save to bend
        bendService.saveGeoLocation({
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed,
          altitude: location.altitude,
          accuracy: location.accuracy,
        }, (error, result)=>{
          console.log(error, result);
        })
      });

      BackgroundGeolocation.start(() => {
        console.log('[DEBUG] BackgroundGeolocation started successfully');
      });
    });
  }

  loadAlerts() {
    //first load alerts
    bendService.getUserAlerts( (error, result)=>{
      if (error) {
        console.log(error);
        return;
      }

      if (result.length > 0) {
        this.hasMounted && this.setState({
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

  showActivityDetailModal() {
    const { 
      subOne, 
      id,
    } = this.props;

    this.setState({ showingModal: true });

    bendService.getActivityWithId(subOne, id, (error, result) => {

      this.setState({ showingModal: false });

      if (error) {
        console.log(error);
        return;
      }
      
      switch( subOne ){
        case 'action':
          Actions.ActionDetailModal({ action: result, modal: true });
          break;

        case 'business':
          Actions.BusinessesDetailModal({ business: result, modal: true });
          break;

        case 'event':
          Actions.EventDetailModal({ event: result, modal: true});
          break;
        
        case 'service':
          Actions.ServiceDetailModal({ service: result, modal: true });
          break;
        
        case 'volunteer_opportunity':
          Actions.VolunteerDetailModal({ volunteer: result, modal: true });
          break;
        
        default:
          break;
      }
      

    });
  }

  onSelectSearch() {
    this.hasMounted && this.setState({
      selectedTab: 'search',
      searchAutoFocus: true,
    });
  }

  onSelectTab( tab ) {
    this.hasMounted && this.setState({
      selectedTab: tab,
    });

    if(tab == 'alerts') {
      this.hasMounted && this.setState({
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
        <Spinner visible={ this.state.showingModal }/>
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
              selectedTab={ this.state.selectedTab }
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
              selectedTab={ this.state.selectedTab }
              subOne={ subOne }
              searchAutoFocus={ this.state.searchAutoFocus }
            />
          </TabNavigator.Item>

          {/* Alert */}
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'alerts' }
            title="Alerts"
            selectedTitleStyle={ styles.selectedText }
            titleStyle={ styles.text }
            renderIcon={ () => <Image source={ this.state.hasNewAlert ? alertIconRed : alertIcon } style={ this.state.hasNewAlert ? styles.iconTabbar3_2 : styles.iconTabbar3 } resizeMode="contain"/> }
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
    height: screenHeight,
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
