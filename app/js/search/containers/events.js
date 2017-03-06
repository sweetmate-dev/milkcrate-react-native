'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ListView,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import CalendarStrip from '../components/calendar/calendarStrip';
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/comonStyles';
import EventsListCell from '../components/eventsListCell';

import { EventsEntries } from '../../components/dummyEntries';

var dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

let arrayValidDate = [];
let eventDays = [];

class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(EventsEntries),
      selectedDate: Date.now(),
      arrayValidDate: [],
    }

    EventsEntries.map((entry) => {
      arrayValidDate.push(true);
      eventDays.push(entry.date);
    });
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

  onFilter () {
    alert("Tapped filter button!");
  }

  onCellPressed (rowID) {

    alert("Tapped cell - " + rowID);
  }

  onSelectDate (date) {

    this.setState({ selectedDate: date });
    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(EventsEntries),
    };
  }

  compareDates( firstDate, secondDate) {
    var timeDiff = firstDate - secondDate;
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays < 0 ? false : true;
  }

  renderListRow(rowData, sectionID, rowID) {

    if (rowID == 'date')
      return null;

    if (arrayValidDate[sectionID] == false)
       return null;

    return (
      <View>
        {
          rowData.map((entry, index) => {
            return (
              <EventsListCell
                key={ index }
                title={ entry.title }
                avatar={ entry.avatar }
                coins={ entry.coins }
                onClick={ () => this.onCellPressed(index) }
              />
            );
          })
        }
      </View>
    );
  }

  renderSectionHeader (sectionData, sectionId) {

    var date = new Date(sectionData.date);
    var value = this.compareDates( date, this.state.selectedDate );

    arrayValidDate[sectionId] = value;

    if ( value == false) {
      return null;
    }

    return (
      <View style={ styles.sectionHeaderContainer }>
        <Text style={ styles.textTitle }>{ sectionData.date }</Text>
      </View>
    );
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          leftButton={ true }
          rightButton={ true }
          onBack={ this.onBack }
          onFilter={ this.onFilter }
          placeholder ='Discover Events'
        />
        <CalendarStrip
          style={ styles.calendar }
          selection={ 'background' }
          calendarColor={ '#d4ebf640' }
          dateNumberStyle={ styles.calendarDateNumber }
          dateNameStyle={ styles.calendarDateName }
          highlightColor={ '#d4ebf6' }
          calendarHeaderStyle={ styles.calendarHeader }
          iconStyle={ styles.calendarIcon }
          iconContainer={{ flex: 0.1 }}
          weekendDateNameStyle={ styles.calendarDateName }
          weekendDateNumberStyle={ styles.calendarDateNumber }
          highlightDateNameStyle={ styles.calendarDateName }
          highlightDateNumberStyle={ styles.calendarDateNumber }
          onDateSelected={ (date) => this.onSelectDate(date) }
          eventDays={ eventDays }
        />
        <ListView
          dataSource={ this.state.dataSource }
          renderRow={ this.renderListRow.bind(this) }
          renderSectionHeader= { this.renderSectionHeader.bind(this) }
        />
      </View>
    );
  }
}

export default connect(state => ({
    status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(Events);

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  calendar: {
    paddingVertical: 10,
  },
  calendarDateNumber: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 10,
  },
  calendarDateName: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 8,
  },
  calendarHeader: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 10,
  },
  calendarIcon: {
    width: 7,
    height: 14,
  },
  sectionHeaderContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: commonStyles.hp(8),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
});