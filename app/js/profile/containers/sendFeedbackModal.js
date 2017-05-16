'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Actions } from 'react-native-router-flux';
import bendService from '../../bend/bendService'

import NavTitleBar from '../../components/navTitleBar';
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
    Keyboard.dismiss();
    Actions.pop();
  }

  onSendUsYourFeedback() {
    if (this.state.textFeedback === '') {
      return;
    }
    
    Keyboard.dismiss();
    
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
        <NavTitleBar
          buttons={ commonStyles.NavCloseTextButton | commonStyles.NavSendButton }
          onBack={ () => this.onClose() }
          onSend={ () => this.onSendUsYourFeedback() }
          title={ "Send Feedback" }
        />
        <KeyboardAwareScrollView>
          <View style={ styles.keyboardContainer }>
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
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
  },  
  keyboardContainer: {
    width: commonStyles.screenWidth,
    height: commonStyles.screenHeight - 64,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    textAlignVertical: 'top',
    fontSize: 16,
    color: commonColors.title,
    padding: 10,    
    backgroundColor: '#fff',    
  },
});
