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
import * as profileActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import ModalDropdown from 'react-native-modal-dropdown';
import DatePicker from 'react-native-datepicker'

import * as commonColors from '../../styles/commonColors';
import { screenWidth, screenHiehgt } from '../../styles/commonStyles';

//added by li
import bendService from '../../bend/bendService'

const background = require('../../../assets/imgs/background_profile.png');
const camera = require('../../../assets/imgs/camera.png');
const triangle_down = require('../../../assets/imgs/triangle_down.png');

import moment from 'moment';
const arrayGender = ['Male', 'Female', 'Other', 'Prefer not to say'];

class SetupProfile extends Component {
  constructor(props) {
    super(props);
    var user = bendService.getActiveUser()
    
    this.state = {
      profilePhoto: null,
      profilePhotoFile:null,
      name: user.name?user.name:'',
      birthday: user.birthdate?moment(user.birthdate, 'YYYY-MM-DD').format('MMM DD, YYYY'):'',
      gender: user.gender?user.gender:'',
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'profile_request') {

    } else if (newProps.status == 'profile_success') {

    } else if (newProps.status == 'profile_error') {

    } 
  }

  onSelectGender(gender) {
    
    this.setState({
      gender: gender
    });
  }

  onCompleteProfile() {

    //check name
    if(this.state.name == '') {
      alert("Please input your first and last name");
      return;
    }

    if(this.state.profilePhotoFile) {
      //upload image first
      bendService.uploadFile(this.state.profilePhotoFile, (err, file)=>{
        if(err) {
          alert("Failed to upload file. Please try again later")
          return;
        }

        this.updateUserInfo(file);
      })
    }
    this.updateUserInfo();
  }

  updateUserInfo(f) {
    var userData = bendService.getActiveUser()
    if(f) {
      userData.avatar = bendService.makeBendFile(f._id)
    }

    userData.name = this.state.name
    if(this.state.birthday) {
      userData.birthdate = moment(new Date(this.state.birthday)).format('YYYY-MM-DD')
    }

    if(this.state.gender) {
      userData.gender = this.state.gender;
    }

    console.log(userData)

    bendService.updateUser(userData, (err, ret)=>{
      console.log(err, ret)
      if(err) {
        alert("Failed to update user profile")
        return;
      }

      Actions.Main();
    })
  }

  onPickProfilePhoto() {

    var options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
      }
    };

    ImagePicker.showImagePicker(options, (response) => {      
      console.log('Response = ', response);

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
          profilePhotoFile:response
        });
      }
    });
  }

  showPhoto () {
    if (this.state.profilePhoto) {
      return (
        <Image source={ this.state.profilePhoto } style={ styles.imagePhoto }/>
      );
    }
      
    return (
      <Image source={ camera } style={ styles.imageCamera }/>
    );
  }

  render() {
    const { status } = this.props;
    return (
      <View style={ styles.container }>
        <Image source={ background } style={ styles.background } resizeMode="cover">
          <View style={ styles.descriptionContainer }>
            <Text style={ styles.textTitle }>Set up Your Profile!</Text>
          </View>
          <View style={ styles.photoContainer }>
            <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onPickProfilePhoto() }>
              <View style={ styles.photoWrapper }>
                { this.showPhoto() }
              </View>
            </TouchableOpacity>  
            <Text style={ styles.textDescription }>Snap or upload profile photo</Text>
          </View>
          <View style={ styles.inputContainer }>
            <TextInput
              autoCapitalize="none"
              autoCorrect={ false }
              placeholder="First & Last Name"
              placeholderTextColor={ commonColors.placeholderText }
              textAlign="center"
              style={ styles.input }
              underlineColorAndroid="transparent"
              returnKeyType={ 'next' }
              onChangeText={ (text) => this.setState({ name: text }) }
            />
            <View style={ styles.inputRowContainer }>
              <DatePicker
                style={ styles.birthdayWrapper }
                date={ this.state.birthday }
                mode="date"
                placeholder="Birthday"
                format="MMM DD, YYYY"
                minDate="Jan 01, 1900"
                maxDate="Dec 31, 2200"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={ false }
                customStyles={{
                  dateInput: {
                    borderColor: '#fff',
                  },
                  placeholderText: {
                    color: commonColors.placeholderText,
                  },
                  dateText: {
                    color: '#000',
                  },
                }}
                onDateChange={ (date) => { this.setState({ birthday: date }) }}
              />
              <View style={ styles.dropDownWrapper }>
                <ModalDropdown
                  options={ arrayGender }
                  defaultValue='Gender'
                  style={ styles.dropdown }
                  textStyle ={ this.state.gender==='' ? styles.dropDownPlaceholderText : styles.dropDownText }
                  dropdownStyle={ styles.dropdownStyle }
                  onSelect={ (rowId, rowData) => this.onSelectGender(rowData) }
                />
                <Image source={ triangle_down } style={ styles.imageTriangleDown }/>
              </View>
            </View>
            <View style={ styles.buttonCompleteProfileWrapper }>
              <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onCompleteProfile() }>
                <View style={ styles.buttonCompleteProfile }>
                  <Text style={ styles.textButton }>Complete Profile</Text>
                </View>  
              </TouchableOpacity>            
            </View>
          </View>
          <View style={ styles.bottomContainer }>            
          </View>
        </Image>
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
)(SetupProfile);

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
  photoContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    width: screenWidth * 0.22,
    height:  screenWidth * 0.22,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCamera: {
    width: 22,
    height: 20,
  },
  imagePhoto: {
    width: screenWidth * 0.22,
    height:  screenWidth * 0.22,
    borderRadius: 5,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
  },
  inputRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'stretch',
  },
  bottomContainer: {
    flex: 1.5,
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
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  buttonCompleteProfileWrapper: {
    alignSelf: 'stretch',
  },
  buttonCompleteProfile: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.theme,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: commonColors.theme,
    borderStyle: 'solid',
    marginTop: 10,
    height: 40,
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  input: {
    fontSize: 14,
    // color: commonColors.title,
    height: 45,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
  },
  birthdayWrapper: {
    height: 45,
    width: (screenWidth - 80) / 2 - 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdown: {
    width: (screenWidth - 80) / 2 - 3,
    height: 45,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownStyle: {
    height: 140,
    width: (screenWidth - 80) / 2 - 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropDownPlaceholderText: {
    width: (screenWidth - 80) / 2 - 3,
    color: commonColors.placeholderText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  dropDownText: {
    width: (screenWidth - 80) / 2 - 3,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  dropDownWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  imageTriangleDown: {
    width: 8,
    height: 6,
    position: 'absolute',
    right: 10,
  },

});