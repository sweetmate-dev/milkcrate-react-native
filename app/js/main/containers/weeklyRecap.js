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
  ScrollView,
  ListView,
} from 'react-native';

import Point from '../../components/Point';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import WeeklyRecapListCell from '../components/weeklyRecapListCell';
import { Actions } from 'react-native-router-flux';

import { WeeklyRecapEntries } from '../../components/dummyEntries';

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

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const icon =   require('../../../assets/imgs/stickers/coffee.png');

export default class WeeklyRecap extends Component {
  constructor(props) {
    super(props);

    var dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      seledtedDays: [false, false, false, false, false, false, false,],
      dataSourceRecentActivity: dataSourceRecentActivity.cloneWithRows(WeeklyRecapEntries),
    };
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {

    return (
      <WeeklyRecapListCell
        title={ rowData.title }
        date={ rowData.date }
        icon={ rowData.icon }
        time={ rowData.time }
        coins={ rowData.coins }
        onClick={ () => this.onWeelyRecapCellPressed(rowID) }
      />
    );
  }

  onSave() {
    Actions.pop();
  }

  onDay( index ) {
    this.setState( (state) => {
      state.seledtedDays[index] = !state.seledtedDays[index];      
      return state;      
    });    
  }

  onWeelyRecapCellPressed (rowID) {
    alert("Tapped cell - " + rowID);
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
        <ScrollView>
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
          <View style={ styles.daysTitleWrapper }> 
            <Text style={ styles.textTitle }>Tap any days you forgot</Text> 
          </View>
          <View style={ styles.daysInfoContainer }>
            <View style={ styles.infoContainer }>
              <Image style={ styles.imageIcon } source={ icon } />
              <View style={ styles.infoSubContainer }>
                <Text style={ styles.textTitle }>Elixr Coffee Roasters</Text>
                <Text style={ styles.textValue }>Checked in 2 times.</Text>
              </View>
              <Point point={ 10 }/>
            </View>
            <View style={ styles.daysContainer }> 
              {
                days.map((item, index) => {
                  return (
                    <TouchableOpacity key={ index } onPress={ () => this.onDay(index) }>
                      <View style={ this.state.seledtedDays[index] ? styles.daySelectedWrapper : styles.dayWrapper }>
                        <Text style={ this.state.seledtedDays[index] ? styles.textSelectedDay : styles.textDay }>{ item }</Text>
                      </View>
                    </TouchableOpacity>  
                  );
                })
              }
            </View>  
          </View>
          <ListView
            dataSource={ this.state.dataSourceRecentActivity }
            renderRow={ this.renderRecentActivityRow.bind(this) }/>

        </ScrollView>  
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
  textTitle: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 8,
    paddingTop: 8,
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
  textValue: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  daysTitleWrapper: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  daysInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    marginTop: 8,
  },
  daysContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  dayWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: commonColors.line,
  },
  daySelectedWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: commonColors.title,
  },
  textDay: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 'bold',
  },  
  textSelectedDay: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontSize: 10,
    fontWeight: 'bold',
  },  
});