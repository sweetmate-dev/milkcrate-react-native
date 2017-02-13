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

import AppIntro from 'react-native-app-intro';
import Login from '../../login/containers/login';

const { width, height } = Dimensions.get('window');

const background1 = require('../../../assets/imgs/introduce/background_introduce1.png');
const background2 = require('../../../assets/imgs/introduce/background_introduce2.png');
const background3 = require('../../../assets/imgs/introduce/background_introduce3.png');
const background4 = require('../../../assets/imgs/introduce/background_introduce4.png');
const background5 = require('../../../assets/imgs/introduce/background_introduce5.png');
const background6 = require('../../../assets/imgs/introduce/background_introduce6.png');

export default class IntroduceForm extends Component {
  constructor(props) {
    super(props);

    StatusBar.setHidden(true);

    this.state = {
      defaultIndex: 0,
    };
  }

  componentWillReceiveProps(newProps) {

  }

  onGoLogin = (index) => {

    this.setState({ defaultIndex : 6 });
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <AppIntro
          onSkipBtnClick={ this.onGoLogin }
          skipBtnLabel="Login"
          nextBtnLabel="Next"
          doneBtnLabel=""
          rightTextColor="#5e8aa3"
          leftTextColor="#5e8aa3"
          dotColor="#d4ebf6"
          activeDotColor="#5e8aa3"
          customStyles = { customStyles }
          defaultIndex = { this.state.defaultIndex }
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
                <Text style={ styles.title }>DISCOVER</Text>
                <Text style={ styles.description }>And check in to hundreds of sustainable</Text>
                <Text style={ styles.description }>businesses in your neighborhood.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background3 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>TAKE IMPACTFUL ACTIONS</Text>
                <Text style={ styles.description }>Take part in our weekly challenges, or earn</Text>
                <Text style={ styles.description }>points for taking random actions throughout</Text>
                <Text style={ styles.description }>the week.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background4 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>PARTICIPATE</Text>
                <Text style={ styles.description }>In volunteer opportunities and</Text>
                <Text style={ styles.description }>green-themed events, all found in our</Text>
                <Text style={ styles.description }>categorized calendar.</Text>
              </View>
              <View style={ styles.paddingBottom }></View>
            </Image>
          </View>
          <View style={ styles.slide }>
            <Image source={ background5 } style={ styles.background } resizeMode="cover">
              <View style={ styles.paddingTop }></View>
              <View style={ styles.contentWrap }>
                <Text style={ styles.title }>EARN POINTS & REWARDS</Text>
                <Text style={ styles.description }>Check in, check off actions, register for</Text>
                <Text style={ styles.description }>events, sign up for services and watch your</Text>
                <Text style={ styles.description }>points automatically tally up!</Text>
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
    width,
    height,
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
    color: '#5e8aa3',
    fontFamily: 'Blanch',
    fontSize: 48,
  },
  description: {
    color: '#5e8aa3',
    fontFamily: 'Open Sans',
    fontSize: 12,
    paddingVertical: 5,
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