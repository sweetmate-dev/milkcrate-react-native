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
import bendService from '../../bend/bendService'
import * as _ from 'underscore'

import { EventsEntries } from '../../components/dummyEntries';

var dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

let arrayValidDate = [];
let eventDays = [];

class EventsView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRefreshing: false,

      selectedDate: Date.now(),
      arrayValidDate: [],
     
      currentLocation: null,
      events: [],

      categoryIcons:[],
      eventsQuery:{
        more: true,
        loading: false,
      },
    };

    this.events = [];
    this.offset = 0;
    this.limit = 1000; //need to fetch all events
    this.searchText = '';
    this.more = true;
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  componentDidMount() {

    this.loadAllData();
  }

  loadAllData() {

    this.setState({

      selectedDate: Date.now(),
      arrayValidDate: [],
     
      currentLocation: null,
      events: [],

      categoryIcons:[],
      eventsQuery:{
        more: true,
        loading: false,
      },
    });

    this.events = [];
    this.offset = 0;
    this.limit = 1000; 
    this.searchText = '';
    this.more = true;

    this.loadEvents();
  }

  onBack () {
    Actions.pop()
  }

  onFilter () {
    alert("Tapped filter button!");
  }

  onCellPressed (event) {
    Actions.EventDetail({event:event});
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

  loadEvents () {

    if (this.more == false)
      return;

    this.setState( (state) => {  
      state.eventsQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          type:'event',
          offset: this.offset,
          limit: this.limit,
          query: this.searchText,
          lat: position.coords.latitude,
          long: position.coords.longitude,
          from:UtilService.formatDateWithFormat(Date.now() * 1000000, "YYYY-MM-DD")
        }, (error, result) => {
          
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
          var events = result.data.event
          _.map(events, (e)=>{
            e.date = UtilService.formatDateWithFormat(e.startsAt, "YYYY-MM-DD");
          })
          events = _.sortBy(events, (e)=>{
            return e.date
          })

          _.each(events, (o)=>{
            var exist = _.find(this.events, (e)=>{
              return e.date == o.date
            })

            if(exist) {
              exist.events.push(o)
            } else {
              this.events.push({
                date:o.date,
                events:[o]
              })
            }
          })

          this.setState({ events: this.events });

          const imageOffset = this.offset;
          this.offset += this.limit;

          result.data.event.map((event, index) => {
            if (event.categories && event.categories.length > 0) {
              var category = UtilService.getCategoryById(event.categories[0])
              this.setState( (state) => {
                state.categoryIcons[event._id] = UtilService.getCategoryIcon(category.slug);
                return state;
              });
            }
          });
        })
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  renderListRow(rowData, sectionID, rowID) {
      if( typeof rowData == 'string') return null;
    return (
      <View>
        {
          rowData.map((entry, index) => {
            return (
              <EventsListCell
                key={ index }
                title={ entry.name }
                icon={ this.state.categoryIcons[entry._id] }
                points={ Number(entry.points||1) }
                onClick={ () => this.onCellPressed(entry) }
              />
            );
          })
        }
      </View>
    );
  }

  renderSectionHeader (sectionData, sectionId) {

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
    const { status } = this.props;

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
          {/*<CalendarStrip
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
          />*/}
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
