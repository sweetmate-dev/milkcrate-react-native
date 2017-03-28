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
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker'

import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

const triangle_down = require('../../../assets/imgs/triangle_down.png');
const arrayGender = ['Male', 'Female', 'Other', 'Prefer not to say'];

class EditProfile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user:bendService.getActiveUser(),
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'edit_profile_request') {

    } else if (newProps.status == 'edit_profile_success') {

    } else if (newProps.status == 'edit_profile_error') {

    }
  }

  onBack() {
    Actions.pop();
  }

  onSaveProfile() {
    bendService.updateUser(this.state.user, (err, ret)=>{
      if(err) {
        console.log(err);return;
      }

      Alert.alert("Profile Updated", "Your changes have been saved.")
    })
  }

  onSelectGender(data) {
    this.state.user.gender = data.toLowerCase()
    this.setState({ user: this.state.user });
  }

  onChangeBirthday(date) {
    this.state.user.birthday = UtilService.formatDateWithFormat2(new Date(date), 'YYYY-MM-DD')
    this.setState({ user: this.state.user });
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ='Edit Profile'
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
            onChangeText={ (text) => { this.state.user.name = text }}
            value={this.state.user.name}
          />
          <TextField
            label='Email'
            autoCorrect={ false }
            autoCapitalize="none"
            keyboardType='email-address'
            inputStyle={ inputStyle }
            labelStyle={ labelStyle }
            wrapperStyle={ wrapperStyle }
            highlightColor='#fff'
            borderColor='#fff'
            value={this.state.user.email}
            onChangeText={ (text) => { this.state.user.email = text }}
          />
          <View style={ styles.cellContainer }>
            <Text style={ styles.textCellTitle }>Gender</Text>
            <View style={ styles.dropDownWrapper }>
              <ModalDropdown
                options={ arrayGender }
                defaultValue={ UtilService.capitalizeFirstLetter(this.state.user.gender) }
                style={ styles.dropdown }
                textStyle ={ styles.dropDownText }
                dropdownStyle={ styles.dropdownStyle }
                onSelect={ (rowId, rowData) => this.onSelectGender(rowData) }
              />
              <Image source={ triangle_down } style={ styles.imageTriangleDown }/>
            </View>
          </View>

          <View style={ styles.cellContainer }>
            <Text style={ styles.textCellTitle }>Date of Birth</Text>
            <DatePicker
              style={ styles.birthdayWrapper }
              date={ UtilService.formatDateWithFormat2(this.state.user.birthday, "MMMM DD, YYYY")}
              mode="date"
              placeholder="Birthday"
              format="MMMM DD, YYYY"
              minDate="Jan 01, 1900"
              maxDate="Dec 31, 2200"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={ false }
              customStyles={{
                dateInput: {
                  borderColor: '#fff',
                  alignItems: 'flex-start',
                },
                dateText: {
                  color: commonColors.grayText,
                  fontFamily: 'OpenSans-Semibold',
                  fontSize: 14,
                },
              }}
              onDateChange={ (date) => this.onChangeBirthday(date) }
            />
          </View>
          <View style={ styles.line }/>

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
  cellContainer: {
    height: 72,
    backgroundColor: '#fff',
    // alignItems: 'flex-start',
    // justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    paddingHorizontal: 16,
  },
  textCellTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    height: 18,
    fontSize: 12,
    marginTop: 8,
  },
  dropDownWrapper: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  dropDownText: {
    color: commonColors.grayText,
    width: commonStyles.screenWidth - 32,
    fontFamily: 'OpenSans-Semibold',
    height: 22,
    fontSize: 14,
  },
  dropdownStyle: {
    height: 140,
    width: commonStyles.screenWidth - 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTriangleDown: {
    width: 8,
    height: 6,
    position: 'absolute',
    right: 10,
  },
  birthdayWrapper: {
    height: 45,
    width: commonStyles.screenWidth - 32,
  },

  line: {
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },

  saveProfileButtonWrapper: {
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
