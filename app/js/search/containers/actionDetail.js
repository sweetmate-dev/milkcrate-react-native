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

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

class ActionDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialize: true,
      didStatus: false,
      activityId: null
    };
  }

  componentDidMount(){
    const action = this.props.action

    bendService.checkActivityDid(action._id,'action', (error, result) => {
      
      if (error) {
        console.log(error);
        return;
      }

      if (result)
          this.state.activityId = result;

      this.setState({
        didStatus: result == false ? false : true,
      })
    })
  }

  onBack () {
    Actions.pop()
  }

  onCheckIn() {
    bendService.captureActivity(this.props.action._id, 'action', (error, result)=>{
      if (error){
        console.log(error);
        return;
      }

      this.state.activityId = result.activity._id;

      this.setState({
        didStatus: true
      })
    })
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
    const { 
      action,
    } = this.props;

    var category = _.find(Cache.categories, (obj) => {
      return obj._id == action.categories[0]
    })

    var backgroundImage, backgroundColor;
    var imageObj = action.coverImage ? action.coverImage : category.coverImage;
    backgroundImage = UtilService.getLargeImage(imageObj);
    backgroundColor = UtilService.getBackColor(imageObj);

    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title ={action.name}
        />
        <ScrollView>
          { this.state.initialize && <Image style={ [styles.imageTopBackground, { backgroundColor:backgroundColor }] } source={{ uri:backgroundImage }}/> }
          <View style={ styles.mainContentContainer }>
            <View style={ styles.infoContainer }>
              <Image style={ styles.imageIcon } source={ UtilService.getCategoryIconFromSlug(action) } />
              <View style={ styles.infoSubContainer }>
                <Text style={ styles.textTitle }>{ action.name }</Text>
              </View>
              <Point point={ Math.max(action.points || 1, 1) }/>
            </View>
            <Text style={ styles.textDescription }>{ action.description }</Text>
            { UtilService.isValidURL(action.url) && <View style={ styles.buttonContainer }>
              <TouchableOpacity onPress={ () => this.visitWebSite(action.url) }>
                <View style={ styles.buttonWrapper }>
                  <Text style={ styles.urlTextButton }>Visit the Website</Text>
                </View>
              </TouchableOpacity>
            </View> }
          </View>
          { action.tags && action.tags.length>0 && <View style={ styles.tagsContainer }>
            <Text style={ styles.textHeading }>Tags</Text>
            <View style={ styles.tagsButtonContainer }>
              {
                action.tags.map( (obj, index) => {
                  return (
                    <View key={'tag-' + index} style={ styles.buttonTagsWrapper }>
                      <Text style={ styles.textTagsButton }>{ obj }</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>}
        </ScrollView>
        { !this.state.didStatus && <TouchableOpacity onPress={ () => this.onCheckIn() }>
          <View style={ styles.buttonCheckin }>
            <Text style={ styles.textButton }>I Did This</Text>
          </View>
        </TouchableOpacity>}
        { this.state.didStatus && <TouchableOpacity onPress={ () => this.onUncheckIn() }>
          <View style={ styles.buttonGrey }>
            <Text style={ styles.textOrange }>I Didn't Do It</Text>
          </View>
        </TouchableOpacity> }
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
  tagsContainer: {
    paddingLeft: 20,
    paddingRight: 16,
    paddingTop: 5,
  },
  tagsButtonContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  buttonTagsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#EFEFEF",
    borderWidth: 5,
    borderStyle: 'solid',
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5
  },
  textTagsButton: {
    textAlign: 'center',
    backgroundColor: "#EFEFEF",
    color: "#A4A4A3",
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  textHeading: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    paddingVertical: 10,
  },
});
