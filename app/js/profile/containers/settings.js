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
  Switch,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as profileActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allowOthersToSeeMyActivity: true,
      pushNotifications: true,
   };
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

  onEditProfile() {
    Actions.EditProfile();
  }

  onChangePassword() {
    Actions.ChangePassword();
  }

  onShareThisApp() {
    alert( 'Tapped onShareThisApp');
  }

  onSendUsYourFeedback() {
    alert( 'Tapped onSendUsYourFeedback');
  }

  onSuggestBusinessOrEvent() {
    alert( 'Tapped onSuggestBusinessOrEvent');
  }

  onAboutMilkCrate() {
    alert( 'Tapped onAboutMilkCrate');
  }

  onPrivacyPolicy() {
    alert( 'Tapped onPrivacyPolicy');
  }

  onTermsOfUse() {
    alert( 'Tapped onTermsOfUse');
  }
  
  onSoftwareLicenses() {
    alert( 'Tapped onSoftwareLicenses');
  }

  onLogOut() {
    alert( 'Tapped onLogOut');
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
        />
        <ScrollView
          style={ styles.scrollView }
        >
          {/* Settings */}
          <Text style={ styles.textSettingsSection }>Settings</Text>
          <TouchableHighlight onPress={ () => this.onEditProfile() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Edit prolfile</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ () => this.onChangePassword() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Change password</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>

          <View style={ styles.cellContainer }>
            <Text style={ styles.textCellTitle }>Allow others to see my activity</Text>
            <Switch onValueChange={ (value) => this.setState({ allowOthersToSeeMyActivity: value })} value={ this.state.allowOthersToSeeMyActivity }/>
          </View>
          <View style={ styles.cellContainer }>
            <Text style={ styles.textCellTitle }>Push notifications</Text>
            <Switch onValueChange={ (value) => this.setState({ pushNotifications: value })} value={ this.state.pushNotifications }/>
          </View>
          <View style={ styles.line }/>

          {/* Communicate */}
          <Text style={ styles.textOtherSection }>Communicate</Text>
          <TouchableHighlight onPress={ () => this.onShareThisApp() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Share this app</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ () => this.onSendUsYourFeedback() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Send us your feedback!</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ () => this.onSuggestBusinessOrEvent() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Suggest a business or event</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <View style={ styles.line }/>
          
          {/* About */}
          <Text style={ styles.textOtherSection }>About</Text>
          <TouchableHighlight onPress={ () => this.onAboutMilkCrate() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>About MilkCrate</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ () => this.onPrivacyPolicy() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Privacy Policy</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ () => this.onTermsOfUse() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Terms of Use</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={ () => this.onSoftwareLicenses() }>
            <View style={ styles.cellContainer }>
              <Text style={ styles.textCellTitle }>Software Licenses</Text>
              <EntypoIcon name="chevron-thin-right" size={ 15 } color={ commonColors.title }/>
            </View>
          </TouchableHighlight>
          <View style={ styles.line }/>

          {/* Logout */}
          <TouchableOpacity onPress={ () => this.onLogOut() }>
            <View style={ styles.logoutButtonWrapper }>
              <Text style={ styles.textLogOut }>Log Out</Text>
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
)(Settings);

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
  textOtherSection: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  cellContainer: {
    flexDirection: 'row',
    width: commonStyles.screenWidth,
    height: 56,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
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
  logoutButtonWrapper: {
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
    marginBottom: 50,
  },
  textLogOut: {
    color: commonColors.bottomButton,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
  },

});
