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

import {Actions} from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');

const background = require('../../../assets/imgs/background_login.png');

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      communityCode: ''
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'login_request') {

    } else if (newProps.status == 'login_success') {

    } else if (newProps.status == 'login_error') {

    }
  }

  onLogIn () {

    if (this.state.email == '') {
        Alert.alert('Please enter email address.');
        return;
    }

    if (this.state.password == '') {
        Alert.alert('Please enter password.');
        return;
    }

    if (this.state.communityCode == '') {
        Alert.alert('Please enter communicy code.');
        return;
    }

    Actions.Main();

    // this.props.login(this.state.email, this.state.password, this.state.communityCode);
  }

  onContactUs () {

      alert("Contact Us");
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <Image source={ background } style={ styles.background } resizeMode="cover">
          <View style={ styles.descriptionWrap }>
            <Text style={ styles.title }>Get Started!</Text>
            <Text style={ styles.description }>
              Did you get our registration email?
            </Text>
            <Text style={ styles.description }>
              Use your credentials below to sign in.
            </Text>
          </View>
          <View style={ styles.inputWrap }>
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor="#9b9b9b"
              textAlign="center"
              style={ styles.input }
              onChangeText={ (text) => this.setState({ email: text }) }
            />
            <TextInput
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="#9b9b9b"
              textAlign="center"
              style={ styles.input }
              onChangeText={ (text) => this.setState({ password: text }) }
            />
            <TextInput
              autoCapitalize="none"
              placeholder="Community Code"
              placeholderTextColor="#9b9b9b"
              textAlign="center"
              style={ styles.input }
              onChangeText={ (text) => this.setState({ communityCode: text }) }
            />
          </View>
          <View style={ styles.bottomWrap }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onLogIn() }>
              <View style={ styles.loginButton }>
                <Text style={ styles.buttonText }>Submit</Text>
              </View>
            </TouchableOpacity>
            <View style={ styles.bottomContentWrap }>
              <Text style={ styles.description }>Didn’t get the email?</Text>
              <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onContactUs() }>
                <Text style={ styles.buttonUnderText }>Contact Us.</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Image>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  background: {
    width,
    height,
  },
  descriptionWrap: {
    flex : 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputWrap: {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomWrap: {
    flex : 1,
    justifyContent: 'flex-start',
  },
  bottomContentWrap: {
    flex : 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  title: {
    color: '#5e8aa3',
    fontFamily: 'Blanch',
    fontSize: 48,
    backgroundColor: 'transparent',
  },
  description: {
    color: '#5e8aa3',
    fontFamily: 'Open Sans',
    fontSize: 12,
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 16,
    color:'#5e8aa3',
    height: 45,
    marginHorizontal: 40,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 5,
  },
  loginButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#82ccbe',
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#82ccbe',
    borderStyle: 'solid',
    marginHorizontal: 40,
    height: 40,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  buttonUnderText: {
    color: '#5e8aa3',
    fontFamily: 'Open Sans',
    fontSize: 14,
    textDecorationLine: 'underline',
    backgroundColor: 'transparent',
  },
});