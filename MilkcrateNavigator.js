import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert, Image, Dimensions, TextInput, TouchableOpacity, Navigator } from 'react-native';

import Milkcrate from "./Milkcrate"
import TabNavigatorView from './screens/tabnavigatorview/TabNavigatorView';

export default class MilkcrateNavigator extends Component {
    renderScene({ name }, navigator) {
        if (name == 'INDEX') {
            return (<Milkcrate navigator={navigator}/>);
        }
        else if (name == 'TAB_NAVIGATOR') {
            return (<TabNavigatorView navigator={navigator}/>);
        }
    }
    configureScene() {
        let config = Navigator.SceneConfigs.PushFromRight;
        config.gestures = {};
        return config;
    }

    render() {
        return (
            <Navigator
                initialRoute={{name: 'INDEX'}}
                renderScene={this.renderScene}
                configureScene={this.configureScene}
                style={{flex: 1}}
            />
        );
    }
}