'use strict';

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

import { bindActionCreators } from 'redux';
import * as homeActions from '../actions';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'home_request') {

    } else if (newProps.status == 'home_success') {

    } else if (newProps.status == 'home_error') {

    }
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <View style={ styles.navigationBarWrap }>
        </View>
        <Text style={ styles.text }>Home is coming soon...</Text>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(homeActions, dispatch)
  })
)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationBarWrap: {
    flexDirection: 'row',
    backgroundColor: '#82ccbe',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#00000021',
    height: 64,
  },
  text: {
    marginTop: 50,
    color: '#82ccbe',
    fontFamily: 'Open Sans',
    fontSize: 20,
    textAlign: 'center',
  },
});
