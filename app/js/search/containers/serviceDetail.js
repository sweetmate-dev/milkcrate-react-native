'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  TextInput,
  TouchableOpacity,
  Alert,
  Button,
    Linking
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as actionDetailActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavTitleBar from '../../components/navTitleBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import Point from '../../components/Point';

//const icon =   require('../../../assets/imgs/category-stickers/bicycles.png');
//const background_top =   require('../../../assets/imgs/background_top_action.png');

const dummyText1 = 'Luxury is something everyone deserves from time to time. Such an indulgence can make a vacation a truly rejuvenating experience. One of the best ways to get the luxury of the rich and famous to fit into your budget can be yours through yacht charter companies. These companies specialize in creating custom sailing vacations that redefine travel.';
const dummyText2 = 'With your budget in mind, it is easy to plan a chartered yacht vacation. Companies often have a fleet of sailing vessels that can accommodate parties of various sizes. You may want to make it a more intimate trip with only close family. There are charters that can be rented for as few as two people. These include either a sailboat or motorboat and can come with or without a crew and captain to sail the ship for you. If you choose not to hire a crew, you will have to show that you are knowledgeable of sailing and can handle the ship competently.';

//added by li, 2017/03/22
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

class ServiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didStatus:false,
      activityId:null
    };

    this.category = _.find(Cache.categories, (o)=>{
      return o._id == this.props.service.categories[0]
    })
  }

  componentDidMount(){
    const service = this.props.service

    bendService.checkActivityDid(service._id,'service', (error, result)=>{

      if(error) {
        console.log(error);
        return;
      }

      if(result)
          this.state.activityId = result;

      this.setState({
        didStatus: result==false?false:true
      })
    })
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onBack () {
    Actions.pop()
  }

  onCheckIn() {
    bendService.captureActivity(this.props.service._id, 'service', (error, result)=>{
      if (error){
        console.log(error);
        return;
      }

      this.state.activityId = result.activity._id;

      this.setState({
        didStatus: true
      })
    })

    if(this.props.service.url)
      this.visitWebSite(this.props.service.url)
  }

  onUncheckIn() {
    bendService.removeActivity(this.state.activityId, (error, result)=>{
      if (error){
        console.log(error);
        return;
      }

      this.state.activityId = null;

      this.setState({
        didStatus: false
      })
    })
  }

  visitWebSite(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    }).catch((error)=>{
      //console.log("URL open error");
    });
  }

  render() {
    const { status, service } = this.props;
    var backgroundImage, backgroundColor;
    var imageObj = service.coverImage?service.coverImage:this.category.coverImage
    backgroundImage = UtilService.getLargeImage(imageObj)
    backgroundColor = UtilService.getBackColor(imageObj)

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ={service.name}
        />
        <ScrollView>
          <Image style={ [styles.imageTopBackground, {backgroundColor:backgroundColor}] } source={{uri:backgroundImage}}/>
          <View style={ styles.mainContentContainer }>
            <View style={ styles.infoContainer }>
              <Image style={ styles.imageIcon } source={ UtilService.getCategoryIcon(this.category.slug) } />
              <View style={ styles.infoSubContainer }>
                <Text style={ styles.textTitle }>{service.name}</Text>
              </View>
              <Point point={ Math.max(service.points||1, 1)} />
            </View>
            <Text style={ styles.textDescription }>{ service.description }</Text>
            {UtilService.isValidURL(service.url)&&<View style={ styles.buttonContainer }>
              <TouchableOpacity onPress={ () => this.visitWebSite(service.url) }>
                <View style={ styles.buttonWrapper }>
                  <Text style={ styles.urlTextButton }>Visit the Website</Text>
                </View>
              </TouchableOpacity>
            </View>}
          </View>
        </ScrollView>
        {!this.state.didStatus&&<TouchableOpacity onPress={ () => this.onCheckIn() }>
          <View style={ styles.buttonCheckin }>
            <Text style={ styles.textButton }>{service.callToAction||'I Did This'}</Text>
          </View>
        </TouchableOpacity>}
        {this.state.didStatus&&<TouchableOpacity onPress={ () => this.onUncheckIn() }>
            <View style={ styles.buttonGrey }>
              <Text style={ styles.textOrange }>I Didn't Do It</Text>
            </View>
          </TouchableOpacity>}
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(actionDetailActions, dispatch)
  })
)(ServiceDetail);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContentContainer: {
    paddingLeft: 20,
    paddingRight: 16,
  },
  imageTopBackground: {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(24),
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  infoSubContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 40,
    height: 40,
  },
  textTitle: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  textDescription: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingVertical: 12,
  },
  textButton: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  textOrange: {
    color: '#F59174',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
  buttonCheckin: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: commonColors.bottomButton,
    height: 40,
  },
  buttonGrey: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    height: 40,
  },
  buttonContainer: {
    paddingTop: 24,
    paddingBottom: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width:commonStyles.screenWidth-50,
    backgroundColor: "#EFEFEF",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
  urlTextButton: {
    color: '#5E8AA3',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
  },
});
