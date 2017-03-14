'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';

import AppIntro from '../components/AppIntro';
import Login from '../../login/containers/login';

import { screenWidth, screenHiehgt } from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const background1 = require('../../../assets/imgs/introduce/background_introduce1.png');
const background2 = require('../../../assets/imgs/introduce/background_introduce2.png');
const background3 = require('../../../assets/imgs/introduce/background_introduce3.png');
const background4 = require('../../../assets/imgs/introduce/background_introduce4.png');
const background5 = require('../../../assets/imgs/introduce/background_introduce5.png');
const background6 = require('../../../assets/imgs/introduce/background_introduce6.png');

export default class Introduce extends Component {
  constructor(props) {
    super(props);

    StatusBar.setHidden(true);
  }

  componentWillReceiveProps(newProps) {

  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <AppIntro
          skipBtnLabel="Log In"
          nextBtnLabel="Next"
          doneBtnLabel=""
          rightTextColor={ commonColors.title }
          leftTextColor={ commonColors.title }
          dotColor= { commonColors.line }
          activeDotColor={ commonColors.title }
          customStyles={ customStyles }
          goLastPage={ true }
        >
          <View style={ styles.slide }>
            <Image source={ background1 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.description }>A platform to help individuals like</Text>
                <Text style={ styles.description }>you make a difference for the</Text>
                <Text style={ styles.description }>environment and your community.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background2 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>Earn Points</Text>
                <Text style={ styles.description }>When you check in to hundreds of</Text>
                <Text style={ styles.description }>sustainable businesses in your neighborhood.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background3 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>TAKE IMPACTFUL ACTIONS</Text>
                <Text style={ styles.description }>Earn more points when you take part in our</Text>
                <Text style={ styles.description }>weekly challenges and for taking random</Text>
                <Text style={ styles.description }>actions throughout the week.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background4 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>Get Involved</Text>
                <Text style={ styles.description }>Volunteer opportunities and</Text>
                <Text style={ styles.description }>green-themed events, all found in our</Text>
                <Text style={ styles.description }>categorized calendar to earn more points.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background5 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>Points For Rewards</Text>
                <Text style={ styles.description }>Use your earned points from all of your</Text>
                <Text style={ styles.description }>activities and challenges on great local.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background6 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>VIEW YOUR PROGRESS</Text>
                <Text style={ styles.description }>See your individual impact and personal</Text>
                <Text style={ styles.description }>achievements as well as your community’s</Text>
                <Text style={ styles.description }>activity for comparison and competition.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <Login/>
        </AppIntro>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: screenWidth,
    height: screenHiehgt,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paddingTop: {
    flex: 5,
  },
  paddingBottom: {
    flex: 1,
  },
  contentWrap: {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: commonColors.title,
    fontFamily: 'Blanch',
    fontSize: 48,
  },
  description: {
    color: commonColors.title,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    paddingVertical: 2,
  },
});

const customStyles = {
  dotStyle: {
    backgroundColor: 'rgba(255,255,255,.3)',
    width: 5,
    height: 5,
    borderRadius: 7,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 7,
    marginBottom: 7,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Open Sans',
  },
  controllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'Open Sans',
  },
};
