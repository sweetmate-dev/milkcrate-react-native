import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');

export default class AlertForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'alert_request') {

    } else if (newProps.status == 'alert_success') {

    } else if (newProps.status == 'alert_error') {

    }
  }


  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
        </View>
        <Text style={ styles.text }>Alert is comming...</Text>
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
  text: {
    marginTop: 50,
    color: '#82ccbe',
    fontFamily: 'Open Sans',
    fontSize: 20,
    textAlign: 'center',
  },
});