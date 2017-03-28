'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as signupActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

var Mailer = require('NativeModules').RNMail;

//added by li
import bendService from '../../bend/bendService'

const background = require('../../../assets/imgs/background_login.png');
const eye = require('../../../assets/imgs/eye.png');
const eye_slash = require('../../../assets/imgs/eye_slash.png');

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      communityCode: '',
      bShowConfirmPassword: true,
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'signup_request') {

    } else if (newProps.status == 'signup_success') {

    } else if (newProps.status == 'signup_error') {

    }
  }

  onSignUp() {

    if (this.state.email == '') {
      Alert.alert('E-mail Required', 'Please enter your email address.');
      return;
    }

    if (this.state.password == '') {
      Alert.alert('Password Required', 'Please enter and confirm your password.');
      return;
    }

    if (this.state.communityCode == '') {
      Alert.alert('Community Code Required', 'Please enter your Community Code. Contact us if you need assistance.');
      return;
    }

      //li added/changes
      bendService.signup({
          username:this.state.email,
          password:this.state.password,
          confirmPassword:this.state.confirmPassword,
          code:this.state.communityCode
      }, (err, user)=>{
          if(err) {
              if(err.name.code == 'milkcrate-app.error.common.missingInput') {
                  alert("Please fill in all the required fields");
              } else if(err.name.code == 'milkcrate-app.error.signup.invalidateEmailFormat') {
                  alert("Please enter a valid email address")
              } else if(err.name.code == 'milkcrate-app.error.signup.passwordDismatch') {
                  alert("Your password and confirmation did not match. Please check them and try again.")
              } else if(err.name.code == 'milkcrate-app.error.signup.invalidCode') {
                  alert("Please enter a valid community code")
              } else if(err.name.code == 'milkcrate-app.error.signup.invalidUsername') {
                  alert("This email address is already taken. Please sign in instead.")
              } else if(err.name.code == 'milkcrate-app.error.common.unknown') {
                  alert("Something's Awry. Please try again later.")
              }
          }

          if(!err) {
              Actions.SetupProfile();
          }
      })

    // this.props.signup(this.state.email, this.state.password, this.state.communityCode);
  }

  onContactUs() {

    Mailer.mail({
      subject: 'Feedback on MilkCrate for Communities',
      recipients: ['info@mymilkcrate.com'],
      body: '',
    }, (error, event) => {
      if(error) {
        Alert.alert('Error', 'Could not send e-mail. Please email us at info@mymilkcrate.com');
      }
    });
  }

  onLearnMore() {
    alert("Learn More");
  }

  onToggleConfirmPassword() {
    this.setState({ bShowConfirmPassword: !this.state.bShowConfirmPassword });
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <Image source={ background } style={ styles.background } resizeMode="cover">
          <View style={ styles.descriptionContainer }>
            <Text style={ styles.textTitle }>Getting Started</Text>
            <Text style={ styles.textDescription }>Your administrator should have sent you an access code.</Text>
            <Text style={ styles.textDescription }>Use this code to gain access to your community.</Text>
          </View>
          <View style={ styles.inputContainer }>
            <TextInput
              ref="email"
              autoCapitalize="none"
              autoCorrect={ false }
              placeholder="Email"
              placeholderTextColor={ commonColors.placeholderText }
              textAlign="center"
              style={ styles.input }
              underlineColorAndroid="transparent"
              returnKeyType={ 'next' }
              keyboardType="email-address"
              value={ this.state.email }
              onChangeText={ (text) => this.setState({ email: text }) }
              onSubmitEditing={ () => this.refs.password.focus() }
            />
            <View style={ styles.inputWrapper }>
              <TextInput
                ref="password"
                autoCapitalize="none"
                autoCorrect={ false }
                placeholder="Password"
                secureTextEntry={ this.state.bShowConfirmPassword }
                placeholderTextColor={ commonColors.placeholderText }
                textAlign="center"
                style={ styles.input }
                underlineColorAndroid="transparent"
                returnKeyType={ 'next' }
                value={ this.state.password }
                onChangeText={ (text) => this.setState({ password: text }) }
                onSubmitEditing={ () => this.refs.confirmPassword.focus() }
              />
            </View>
            <View style={ styles.inputWrapper }>
              <TextInput
                ref="confirmPassword"
                autoCapitalize="none"
                autoCorrect={ false }
                placeholder="Confirm Password"
                secureTextEntry={ this.state.bShowConfirmPassword }
                placeholderTextColor={ commonColors.placeholderText }
                textAlign="center"
                style={ styles.input }
                underlineColorAndroid="transparent"
                returnKeyType={ 'next' }
                value={ this.state.confirmPassword }
                onSubmitEditing={ () => this.refs.communityCode.focus() }
                onChangeText={ (text) => this.setState({ confirmPassword: text }) }
              />
              <TouchableOpacity
                activeOpacity={ .5 }
                style={ styles.eyeButtonWrapper }
                onPress={ () => this.onToggleConfirmPassword() }
              >
                <Image source={ this.state.bShowConfirmPassword ? eye : eye_slash } style={ styles.imageEye }/>
              </TouchableOpacity>
            </View>
            <TextInput
              ref="communityCode"
              autoCapitalize="none"
              autoCorrect={ false }
              placeholder="Community Code"
              placeholderTextColor={ commonColors.placeholderText }
              textAlign="center"
              style={ styles.input }
              underlineColorAndroid="transparent"
              returnKeyType={ 'go' }
              value={ this.state.communityCode }
              onChangeText={ (text) => this.setState({ communityCode: text }) }
              onSubmitEditing={ () => this.onSignUp() }
            />
          </View>
          <View style={ styles.bottomContainer }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onSignUp() }>
              <View style={ styles.buttonSubmit }>
                <Text style={ styles.textButton }>Submit</Text>
              </View>
            </TouchableOpacity>
            <View style={ styles.bottomContentWrap }>
              <Text style={ styles.textInvite }>Don’t know your access code?</Text>
              <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onContactUs() }>
                <Text style={ styles.textUnderButton }>Contact Us.</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={ .5 } style={{ marginTop: 16 }} onPress={ () => this.onLearnMore() }>
                {/*<Text style={ styles.textUnderButton }>Learn More</Text>*/}
              </TouchableOpacity>

            </View>
          </View>
        </Image>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.auth.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(signupActions, dispatch)
  })
)(Signup);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: screenWidth,
    height: screenHiehgt,
  },
  descriptionContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  inputContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  bottomContentWrap: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  textTitle: {
    color: commonColors.title,
    fontFamily: 'Blanch',
    fontSize: 48,
    backgroundColor: 'transparent',
  },
  textDescription: {
    color: commonColors.title,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 12,
    paddingTop: 5,
    backgroundColor: 'transparent',
  },
  textInvite: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 12,
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  imageEye: {
    width: 20,
    height: 13,
  },
  eyeButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    right: 40,
  },
  inputWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  input: {
    fontSize: 14,
    color: commonColors.title,
    height: 45,
    alignSelf: 'stretch',
    marginHorizontal: 40,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 5,
    paddingHorizontal: 30,
  },
  buttonSubmit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.theme,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: commonColors.theme,
    borderStyle: 'solid',
    marginHorizontal: 40,
    height: 40,
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textUnderButton: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    backgroundColor: 'transparent',
  },
});
