'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';

import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';

const exploreWays = [
  {
    title: 'Actions',
    count: 0,
    icon: require('../../../assets/imgs/actions.png'),
    iconWidth: 22,
    iconHeight: 22,
  },
  {
    title: 'Check-ins',
    count: 1,
    icon: require('../../../assets/imgs/businesses.png'),
    iconWidth: 14,
    iconHeight: 21,
  },
  {
    title: 'Services',
    count: 1,
    icon: require('../../../assets/imgs/services.png'),
    iconWidth: 23,
    iconHeight: 20,
  },
  {
    title: 'Events',
    count: 1,
    icon: require('../../../assets/imgs/events.png'),
    iconWidth: 23,
    iconHeight: 25,
  },
  {
    title: 'Volunteer',
    count: 1,
    icon: require('../../../assets/imgs/volunteer.png'),
    iconWidth: 26,
    iconHeight: 25,
  },
];

export default class WeeklyRecap extends Component {
  constructor(props) {
    super(props);
  }

  onSave() {
    alert("tapped onSave!");
  }

  render() {
    const { status, subOne } = this.props;

    return (
      <View style={ styles.container }>
        <View style={ styles.headerContainer }>
          <View style={ styles.bothSideWrapper }/>
          <View style={ styles.headerTitleWrapper }>
            <Text style={ styles.textHeaderTitle }>Weekly Recap 2/16-2/22</Text>  
          </View>
          <View style={ styles.bothSideWrapper }>
            <TouchableOpacity onPress={ () => this.onSave() }>
              <View style={ styles.saveWrapper }>
                <Text style={ styles.textSave }>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={ styles.pointContainer }>
          <View style={ styles.subContainer }>
            <Text style={ styles.textValue1 }>29</Text>
            <Text style={ styles.textBottomTitle }>Points this Week</Text>
          </View>
          <View style={ styles.subContainer }>
            <Text style={ styles.textValue2 }>50%</Text>
            <Text style={ styles.textBottomTitle }>Increase</Text>
          </View>
          <View style={ styles.subContainer }>
            <Text style={ styles.textValue3 }>341</Text>
            <Text style={ styles.textBottomTitle }>Total Points</Text>
          </View>
        </View>
        
        <View style={ styles.exploreWaysContainer }>
          {
            exploreWays.map((item, index) => {
              return (
                <View key={ index } style={ styles.subContainer }>
                  <Text style={ styles.textCount }>{ item.count }</Text>
                  <Image style={ [{ width: item.iconWidth }, { height: item.iconHeight }, { marginVertical: 12 }] } source={ item.icon }/>
                  <Text style={ styles.textBottomTitle }>{ item.title }</Text>
                </View>
              );
            })
          }
        </View>  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonColors.percentListCellWeakBackground,
    height: 58,    
  },
  headerTitleWrapper: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeaderTitle: {
    color: commonColors.title,
    fontFamily: 'Blanch',
    fontSize: 28,
  },
  bothSideWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textSave: {
    color: commonColors.title,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 12,
    textAlign: 'center',
  },
  pointContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 20,
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textValue1: {
    color: '#bdd5ef',
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  textValue2: {
    color: '#82ccbe',
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  textValue3: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  textBottomTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',    
  },
  exploreWaysContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 25,
    marginBottom: 20,
    marginHorizontal: 25,
  },
  textCount: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
  },

});