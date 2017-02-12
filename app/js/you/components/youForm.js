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

export default class YouForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'you_request') {

    } else if (newProps.status == 'you_success') {

    } else if (newProps.status == 'you_error') {

    }
  }


  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <Text style={ styles.text }>You is comming...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  text: {

    marginTop: 50,
    color: '#82ccbe',
    fontFamily: 'Open Sans',
    fontSize: 20,
    textAlign: 'center',
  },
});