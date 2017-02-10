import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

const { width, height } = Dimensions.get('window');

const homeIcon = require('../../../assets/imgs/tabbar_home.png');
const homeSelectedIcon = require('../../../assets/imgs/tabbar_home_selected.png');
const searchIcon = require('../../../assets/imgs/tabbar_search.png');
const searchSelectedIcon = require('../../../assets/imgs/tabbar_search_selected.png');
const alertIcon = require('../../../assets/imgs/tabbar_alert.png');
const alertSelectedIcon = require('../../../assets/imgs/tabbar_alert_selected.png');
const youIcon = require('../../../assets/imgs/tabbar_you.png');
const youelectedIcon = require('../../../assets/imgs/tabbar_you_selected.png');

export default class MainForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTab: '',//home
      badge: 0,
    };
  }

  render() {
    const {status} = this.props;

    return (
      <View style={ styles.container }>
        <TabNavigator>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'home' }
            title="Home"
            renderIcon={ () => <Image source={ homeIcon } style={ styles.iconTabbar1 }/> }
            renderSelectedIcon={ () => <Image source={ homeSelectedIcon } style={ styles.iconTabbar1 }/> }
            onPress={ () => this.setState({ selectedTab: 'home' }) }>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'search' }
            title="Search"
            renderIcon={ () => <Image source={ searchIcon } style={ styles.iconTabbar2 }/> }
            renderSelectedIcon={ () => <Image source={ searchSelectedIcon } style={ styles.iconTabbar2 }/> }
            onPress={ () => this.setState({selectedTab: 'search' }) }>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'alert' }
            title="Alert"
            renderIcon={ () => <Image source={ alertIcon } style={ styles.iconTabbar3 }/> }
            renderSelectedIcon={ () => <Image source={ alertSelectedIcon } style={ styles.iconTabbar1 }/> }
            badgeText={ this.state.badge }
            onPress={ () => this.setState({selectedTab: 'alert' }) }>
          </TabNavigator.Item>
          <TabNavigator.Item
            selected={ this.state.selectedTab === 'you' }
            title="You"
            renderIcon={ () => <Image source={ youIcon } style={ styles.iconTabbar4 }/> }
            renderSelectedIcon={ () => <Image source={ youelectedIcon } style={ styles.iconTabbar3 }/> }
            onPress={ () => this.setState({selectedTab: 'you' }) }>
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
    width,
    height,
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

});
