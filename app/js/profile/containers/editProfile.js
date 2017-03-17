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

import { bindActionCreators } from 'redux';
import * as profileActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import TextField from 'react-native-md-textinput';

import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

class EditProfile extends Component {

  constructor(props) {
    super(props);

    this.userName = '';
    this.email = '';    
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'settings_request') {

    } else if (newProps.status == 'settings_success') {

    } else if (newProps.status == 'settings_error') {

    }
  }

  onBack() {
    Actions.pop();
  }

  onSaveProfile() {
    alert( 'Tapped onSaveProfile');
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
        />
        <ScrollView style={ styles.scrollView }>

          <Text style={ styles.textSettingsSection }>User Profile</Text>
            <TextField
              label='First & Last Name'
              autoCorrect={ false }
              inputStyle={ inputStyle }
              labelStyle={ labelStyle }
              wrapperStyle={ wrapperStyle }
              highlightColor='#fff'
              borderColor='#fff'
              onChangeText={ (text) => { this.userName = text }}
            />
            <TextField
              label='Email'
              autoCorrect={ false }
              keyboardType='email-address'
              inputStyle={ inputStyle }
              labelStyle={ labelStyle }
              wrapperStyle={ wrapperStyle }
              highlightColor='#fff'
              borderColor='#fff'
              onChangeText={ (text) => { this.emai = text }}
            />
          <TouchableOpacity onPress={ () => this.onSaveProfile() }>
            <View style={ styles.saveProfileButtonWrapper }>
              <Text style={ styles.textSaveProfile }>Save Profile</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.profile.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(profileActions, dispatch)
  })
)(EditProfile);

const inputStyle = {
  color: commonColors.grayText,
  fontFamily: 'OpenSans-Semibold',
  fontSize: 14,
  paddingHorizontal: 16,
};

const labelStyle={
  color: commonColors.grayMoreText,
  fontFamily: 'Open Sans',
  fontSize: 12,
  paddingHorizontal: 16,
};

const wrapperStyle={
  height: 72,
  backgroundColor: '#fff',
  borderTopWidth: 1,
  borderTopColor: commonColors.line,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  textSettingsSection: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    marginTop: 40,
    marginLeft: 8,
    marginBottom: 8,
  },
  textValue: {
    color: commonColors.grayText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
  },
  cellContainer: {
    width: commonStyles.screenWidth,
    height: 72,
    backgroundColor: '#fff',
    // alignItems: 'flex-start',
    // justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    paddingHorizontal: 16,
  },



  textOtherSection: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  line: {
    width: commonStyles.screenWidth,
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },
  textCellTitle: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  saveProfileButtonWrapper: {
    width: commonStyles.screenWidth,
    height: 56,
    backgroundColor: '#fff',    
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    marginTop: 24,
  },
  textSaveProfile: {
    color: '#82ccbe',
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
  },

});
