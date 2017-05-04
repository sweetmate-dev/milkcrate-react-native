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
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';
import CalendarStrip from '../components/calendar/calendarStrip';
import NavSearchBar from '../../components/navSearchBar';
import * as commonColors from '../../styles/commonColors';
import * as commonStyles from '../../styles/commonStyles';
import EventsListCell from '../components/eventsListCell';

import UtilService from '../../components/util'
import Cache from '../../components/Cache'
import bendService from '../../bend/bendService'
import * as _ from 'underscore'

import { EventsEntries } from '../../components/dummyEntries';

var dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

class EventsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,

      arrayValidDate: [],
      eventDays: [],
     
      currentLocation: null,
      events: [],

      categoryIcons:[],
      eventsQuery: {
        more: true,
        loading: false,
      },
    };

    this.eventDays = [];
    this.events = [];
    this.offset = 0;
    this.limit = 1000; //need to fetch all events
    this.searchText = '';
    this.more = true;
  }

  componentDidMount() {
    this.loadAllData();
  }

  loadAllData() {
    this.setState({
      arrayValidDate: [],
      eventDays: [],

      currentLocation: null,
      events: [],

      categoryIcons: [],
      eventsQuery: {
        more: true,
        loading: false,
      },
    });

    this.eventDays = [];
    this.events = [];
    this.offset = 0;
    this.limit = 1000; 
    this.searchText = '';
    this.more = true;

    this.loadEvents();
  }

  onBack() {
    Actions.pop()
  }

  onFilter() {
    alert("Tapped filter button!");
  }

  onCellPressed(event) {
    Actions.EventDetail({event:event});
  }

  onSelectDate(selectedDate) {
    let newEvents = [];

    _.each(this.events, (event) => {

      if (this.compareDates(event.date, selectedDate) == false)
        return;
      
      newEvents.push(event);
    })

    this.setState({ events: newEvents });
  }

  compareDates( firstDate, secondDate) {
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);

    var timeDiff = date1 - date2;
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays < 0 ? false : true;
  }

  loadEvents() {
    if (this.more == false)
      return;

    this.setState( (state) => {  
      state.eventsQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {
        this.search(position)
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.search(null)
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  search(position) {
    if(position)
      this.setState({ currentLocation: position })

    var param = {
      type: 'event',
      offset: this.offset,
      limit: this.limit,
      query: this.searchText,
      from: UtilService.formatDateWithFormat(Date.now() * 1000000, "YYYY-MM-DD")
    }

    if(position) {
      param.lat = position.coords.latitude;
      param.long = position.coords.longitude;
    } else {
      if(Cache.community && Cache.community._geoloc) {
        param.lat = Cache.community._geoloc[1];
        param.long = Cache.community._geoloc[0];
      }
    }

    bendService.searchActivity(param, (error, result) => {

      this.setState( (state) => {
        state.eventsQuery.loading = false;
        return state;
      });

      this.setState({ isRefreshing: false });

      if (error) {
        console.log("search failed", error)
        return
      }

      if (result.data.event.length < this.limit) {
        this.more = false;
        this.setState( (state) => {
          state.eventsQuery.more = false;
          return state;
        });
      }

      //group by with date
      var events = result.data.event;
      _.map(events, (event) => {
        event.date = UtilService.formatDateWithFormat(event.startsAt, "YYYY-MM-DD");
      })
      events = _.sortBy(events, (event) => {
        return event.date
      })

      _.each(events, (event) => {
        var exist = _.find(this.events, (entry) => {
          return entry.date == event.date;
        })

        if (exist) {
          exist.events.push(event);
        } else {
          this.events.push({
            date: event.date,
            events: [event],
          })
        }
      })

      this.setState({ events: this.events });

      this.events.map( (entry) => {
        this.eventDays.push( entry.date );
      });

      this.setState({ eventDays: this.eventDays });

      const imageOffset = this.offset;
      this.offset += this.limit;

      result.data.event.map((event, index) => {
        this.setState( (state) => {
          state.categoryIcons[event._id] = UtilService.getCategoryIconFromSlug(event);
          return state;
        });
      });
    })
  }

  renderListRow(rowData, sectionID, rowID) {
    if( typeof rowData == 'string') 
      return null;

    return (
      <View>
        {
          rowData.map((entry, index) => {
            return (
              <EventsListCell
                key={ index }
                title={ entry.name }
                icon={ this.state.categoryIcons[entry._id] }
                points={ Number(entry.points || 1) }
                onClick={ () => this.onCellPressed(entry) }
              />
            );
          })
        }
      </View>
    );
  }

  renderSectionHeader(sectionData, sectionId) {
    return (
      <View style={ styles.sectionHeaderContainer }>
        <Text style={ styles.textTitle }>{ UtilService.formatDateWithFormat2(sectionData.date, "MMMM DD, YYYY") }</Text>
      </View>
    );
  }

  onRefresh() {
    this.setState({ isRefreshing: true });
    this.loadAllData();    
  }

  render() {

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          placeholder ='Search for events'
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={ this.state.isRefreshing }
              onRefresh={ () => this.onRefresh() }
              tintColor={ commonColors.theme }
            />
          }
        >
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
            eventDays={ this.state.eventDays }
          />
          <ListView
            enableEmptySections={ true }
            dataSource={ dataSource.cloneWithRowsAndSections(this.state.events)}
            renderRow={ this.renderListRow.bind(this) }
            renderSectionHeader= { this.renderSectionHeader.bind(this) }
          />
        </ScrollView>
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
)(EventsView);

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
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
  },
});
