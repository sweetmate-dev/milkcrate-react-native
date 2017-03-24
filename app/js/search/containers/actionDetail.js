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

const icon =   require('../../../assets/imgs/stickers/bicycles.png');
const background_top =   require('../../../assets/imgs/background_top_action.png');

const dummyText1 = 'Luxury is something everyone deserves from time to time. Such an indulgence can make a vacation a truly rejuvenating experience. One of the best ways to get the luxury of the rich and famous to fit into your budget can be yours through yacht charter companies. These companies specialize in creating custom sailing vacations that redefine travel.';
const dummyText2 = 'With your budget in mind, it is easy to plan a chartered yacht vacation. Companies often have a fleet of sailing vessels that can accommodate parties of various sizes. You may want to make it a more intimate trip with only close family. There are charters that can be rented for as few as two people. These include either a sailboat or motorboat and can come with or without a crew and captain to sail the ship for you. If you choose not to hire a crew, you will have to show that you are knowledgeable of sailing and can handle the ship competently.';

//added by li, 2017/03/22
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

class ActionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category:{
        coverImage:{
          _downloadURL:null
        }
      },
      initialize:false,
      didStatus:false
    };
  }

  componentDidMount(){
    const action = this.props.action

    bendService.checkActionDid(action._id, (err, ret)=>{
      if(err) {
        console.log(err);return;
      }

      this.setState({
        didStatus:ret
      })
    })

    //console.log(action)
    if(action.categories&&action.categories.length >0) {
      bendService.getCategory(action.categories[0], (err, ret)=>{
        if(err){
          console.log(err);return
        }

        this.setState({
          category:ret,
          initialize:true
        })
      })
    }
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

  onCheckin() {
    bendService.captureActivity(this.props.action._id, 'action', (err,ret)=>{
      if(err){
        console.log(err);return;
      }

      this.setState({
        didStatus:true
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
    const { status, action } = this.props;

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ={action.name}
        />
        <ScrollView>
          {this.state.initialize&&<Image style={ styles.imageTopBackground } source={{uri:action.coverImage?action.coverImage._downloadURL:this.state.category.coverImage._downloadURL}}/>}
          <View style={ styles.mainContentContainer }>
            <View style={ styles.infoContainer }>
              <Image style={ styles.imageIcon } source={ UtilService.getCategoryImage(this.state.category.slug) } />
              <View style={ styles.infoSubContainer }>
                <Text style={ styles.textTitle }>{action.name}</Text>
              </View>
              <Point point={ action.points||0} />
            </View>
            <Text style={ styles.textDescription }>{ action.description }</Text>
            {action.url&&<View style={ styles.buttonContainer }>
              <TouchableOpacity onPress={ () => this.visitWebSite(action.url) }>
                <View style={ styles.buttonWrapper }>
                  <Text style={ styles.urlTextButton }>Visit the Website</Text>
                </View>
              </TouchableOpacity>
            </View>}
          </View>
        </ScrollView>
        {!this.state.didStatus&&<TouchableOpacity onPress={ () => this.onCheckin() }>
          <View style={ styles.buttonCheckin }>
            <Text style={ styles.textButton }>I Did This</Text>
          </View>
        </TouchableOpacity>}
        {this.state.didStatus&&<View style={ styles.buttonGrey }>
          <Text style={ styles.textOrange }>I Didn't Do It</Text>
        </View>}
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
)(ActionDetail);

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