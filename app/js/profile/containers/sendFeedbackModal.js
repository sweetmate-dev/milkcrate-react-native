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
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import { Actions } from 'react-native-router-flux';
import bendService from '../../bend/bendService'

import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

export default class SendFeedbackModal extends Component {

  constructor(props) {
    super(props);

    this.state =  {
      textFeedback: "",
      sending: false,
    }
  }

  onClose() {
    Actions.pop();
  }

  onSendUsYourFeedback() {

    if (this.state.textFeedback === '') {
      return;
    }

    this.setState({ sending: true });
    bendService.sendFeedback( this.state.textFeedback, (error, result) => {

      this.setState({ sending: false });
      if (error) {
        console.log(error);
        return;
      }

      this.onClose();
    })
  }

  render() {

    return (
      <View style={ styles.container }>
        <Spinner visible={ this.state.sending }/>
        <View style={ styles.topContainer }/>
        <View style={ styles.centerContainer }>
          <View style={ styles.titleContainer}>
            <TouchableOpacity onPress={ () => this.onClose() }>
              <Text style={ styles.textDescription }>Close</Text>
            </TouchableOpacity>
            <Text style={ styles.textTitle }>Send Feedback</Text>
            <TouchableOpacity onPress={ () => this.onSendUsYourFeedback() }>
              <Text style={ styles.textDescription }>Send</Text>
            </TouchableOpacity>
          </View>
          <View style={ styles.contentContainer }>
            <TextInput
              autoCorrect={ false }
              multiline={ true }
              placeholder="Type your feedback"
              placeholderTextColor={ commonColors.placeholderText }
              textAlign="left"
              style={ styles.input }
              underlineColorAndroid="transparent"
              onChangeText={ (text) => this.setState({ textFeedback: text }) }              
            />
          </View>
        </View>
        <View style={ styles.bottomContainer }>
          <View style={ styles.bottomPadding }/>
        </View>        
      </View>
    );
  }
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#000000c0',
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  topContainer: {
    flex: 1.5,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 5,
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  bottomContainer: {
    flex: 1.5,
    backgroundColor: 'transparent',
  },
  bottomPadding: {
    flex: 0.5,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: commonColors.theme,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  contentContainer: {
    flex: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  textTitle: {
    color: '#fff',
    fontFamily: 'Blanch',
    fontSize: 40,
  },
  textDescription: {
    color: '#fff',    
    fontFamily: 'Open Sans',
    fontSize: 18,
    padding: 10,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    fontSize: 16,
    color: commonColors.title,
    margin: 10,    
    backgroundColor: '#fff',    
  },

});
