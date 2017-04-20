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

import Spinner from 'react-native-loading-spinner-overlay';
import timer from 'react-native-timer';
import TextField from 'react-native-md-textinput';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker'
import ResponsiveImage from 'react-native-responsive-image';
import ImagePicker from 'react-native-image-picker';

import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

const triangle_down = require('../../../assets/imgs/triangle_down.png');
const camera = require('../../../assets/imgs/camera_full.png');

const arrayGender = ['Male', 'Female', 'Other', 'Prefer not to say'];

class EditProfile extends Component {

  constructor(props) {
    super(props);

    this.user = bendService.getActiveUser();
    this.state = {
      user: this.user,
      profilePhoto: camera,
      profilePhotoFile: null,
      activityStatus: false,
    };
  }

  componentDidMount() {

    if (this.user.avatar != null) {
      bendService.getUser( (error, result) => {

        if (error) {
          console.log(error);
          return;
        }
  
        console.log( 'user avatar : ', result);

        const source = { uri: UtilService.getMiddleImage(result.avatar) };
        this.setState({ profilePhoto: source });
      })
    }
  }

  onBack() {
    Actions.pop();
  }

  updateUserInfo(file) {
  
    let userData = this.state.user;

    if (file) {
      userData.avatar = bendService.makeBendFile(file._id);
    } else {
      userData.avatar = null;
    }

    bendService.updateUser(userData, (error, result) => {

      this.setState({ activityStatus: false });

      if (error) {
        console.log(error);        
        return;
      }

      timer.setTimeout( this, 'UpdateUser', () => {
        timer.clearInterval(this, 'UpdateUser');
        Alert.alert("Profile Updated", "Your changes have been saved.");
      }, 200);
    })
  }

  onSaveProfile() {

    this.setState({ activityStatus: true });

    if (this.state.profilePhotoFile) {
      //upload image first
      bendService.uploadFile(this.state.profilePhotoFile, (error, file)=>{
        this.setState({
          isUploadingFile:false
        })
        if (error) {

          this.setState({ activityStatus: false });

          timer.setTimeout( this, 'UpdateUser', () => {
            timer.clearInterval(this, 'UpdateUser');
            alert("Failed to upload file. Please try again later");
          }, 200);

          return;
        }
        console.log( 'uploaded file : ', file);

        this.updateUserInfo(file);
      }, 
      {
        _workflow: 'avatar'
      });
    } else {
      this.updateUserInfo();
    }
  }

  onSelectGender(data) {
    this.state.user.gender = data.toLowerCase();
    this.setState({ user: this.state.user });
  }

  onChangeBirthday(date) {
    this.state.user.birthday = UtilService.formatDateWithFormat2(new Date(date), 'YYYY-MM-DD');
    this.setState({ user: this.state.user });
  }

  onPickProfilePhoto() {

    let options;

    if (this.state.profilePhoto === camera) {
      options = {
        quality: 1.0,
        storageOptions: {
          skipBackup: true,
        }
      };
    } else {
      options = {
        quality: 1.0,
        storageOptions: {
          skipBackup: true,
        },
        customButtons:[{
          name:"remove",
          title:"Remove Photo"
        }]
      };
    }
    
    ImagePicker.showImagePicker(options, (response) => {

      if (response.customButton == 'remove') {
        this.setState({
          profilePhoto: camera,
          profilePhotoFile: null,
        });
        return;
      }
      //console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } 
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error); 
      }
      else {
        let source = { uri: response.uri };

        this.setState({
          profilePhoto: source,
          profilePhotoFile: response,
        });
      }
    });
  }

  render() {
    return (
      <View style={ styles.container }>
        <Spinner visible={ this.state.activityStatus }/>

        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ='Edit Profile'
        />
        <ScrollView style={ styles.scrollView }>
          <View style={ styles.photoContainer }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onPickProfilePhoto() }>
              <View style={ styles.photoWrapper }>
                <ResponsiveImage source={ this.state.profilePhoto } style={ styles.imagePhoto } />
              </View>
            </TouchableOpacity>  
          </View>

          {/*<Text style={ styles.textSettingsSection }>User Profile</Text>*/}
          <TextField
            label='First & Last Name'
            autoCorrect={ false }
            inputStyle={ inputStyle }
            labelStyle={ labelStyle }
            wrapperStyle={ wrapperStyle }
            highlightColor='#fff'
            borderColor='#fff'
            onChangeText={ (text) => { this.state.user.name = text }}
            value={ this.state.user.name }
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
              date={ UtilService.formatDateWithFormat2(this.state.user.birthday, "MMMM DD, YYYY") }
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
  photoContainer: {
    marginVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    width: commonStyles.screenWidth * 0.22,
    height:  commonStyles.screenWidth * 0.22,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePhoto: {
    width: commonStyles.screenWidth * 0.22,
    height:  commonStyles.screenWidth * 0.22,
    borderRadius: 5,
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
