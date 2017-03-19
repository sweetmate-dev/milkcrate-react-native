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
import * as loginActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

const background = require('../../../assets/imgs/background_profile.png');
const eye = require('../../../assets/imgs/eye.png');
const eye_slash = require('../../../assets/imgs/eye_slash.png');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      bShowConfirmPassword: true,
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'login_request') {

    } else if (newProps.status == 'login_success') {

    } else if (newProps.status == 'login_error') {

    }
  }

  onLogin() {

    if (this.state.email == '') {
      Alert.alert('Please enter email address.');
      return;
    }

    if (this.state.password == '') {
      Alert.alert('Please enter password.');
      return;
    }

    Actions.Main();

    // this.props.signup(this.state.email, this.state.password, this.state.communityCode);
  }

  onForgotPassword() {
    alert("onForgotPassword");
  }

  onCreateAccount() {
    Actions.Signup();
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
            <Text style={ styles.textTitle }>Log In</Text>
            <Text style={ styles.textDescription }>Welcome back!</Text>
            <Text style={ styles.textDescription }>If you don’t have an account you’ll need to </Text>
            <Text style={ styles.textDescription }>create one.</Text>
          </View>
          <View style={ styles.inputContainer }>
            <TextInput
              autoCapitalize="none"
              autoCorrect={ false }
              placeholder="Email"
              placeholderTextColor={ commonColors.placeholderText }
              textAlign="center"
              style={ styles.input }
              underlineColorAndroid="transparent"
              returnKeyType={ 'next' }
              onChangeText={ (text) => this.setState({ email: text }) }
            />            
            <View style={ styles.inputWrapper }>
              <TextInput
                autoCapitalize="none"
                autoCorrect={ false }
                placeholder="Password"
                secureTextEntry={ this.state.bShowConfirmPassword }
                placeholderTextColor={ commonColors.placeholderText }
                textAlign="center"
                style={ styles.input }
                underlineColorAndroid="transparent"
                returnKeyType={ 'next' }
                onChangeText={ (text) => this.setState({ password: text }) }
              />
              <TouchableOpacity 
                activeOpacity={ .5 } 
                style={ styles.eyeButtonWrapper }
                onPress={ () => this.onToggleConfirmPassword() }
              >
                <Image source={ this.state.bShowConfirmPassword ? eye : eye_slash } style={ styles.imageEye }/>
              </TouchableOpacity>
            </View>
            <View style={ styles.buttonWrapper }>
              <TouchableOpacity 
                activeOpacity={ .5 } 
                onPress={ () => this.onForgotPassword() }
              >
                <Text style={ styles.textTitleButton }>Forgot Password</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              activeOpacity={ .5 } 
              style={ styles.loginButtonWrapper }
              onPress={ () => this.onLogin() }
            >
              <View style={ styles.buttonLogin }>
                <Text style={ styles.textButton }>Log In</Text>
              </View>
            </TouchableOpacity>

            <View style={ styles.buttonWrapper }>
              <TouchableOpacity 
                activeOpacity={ .5 } 
                onPress={ () => this.onCreateAccount() }
              >
                <Text style={ styles.textTitleButton }>Create Account</Text>
              </TouchableOpacity>
            </View>
            
          </View>
          <View style={ styles.bottomContainer }/>
        </Image>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.auth.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(loginActions, dispatch)
  })
)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: screenWidth,
    height: screenHiehgt,
  },
  descriptionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  inputContainer: {
    flex: 1,
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
  loginButtonWrapper: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
  buttonWrapper: {
    marginTop: 16,
    alignItems: 'center',
  },
  buttonLogin: {
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
  textTitleButton: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});