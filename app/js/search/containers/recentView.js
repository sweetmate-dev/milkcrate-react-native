'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Text,
  View,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavTitleBar from '../../components/navTitleBar';
import BusinessesListCell from '../components/businessesListCell';
import EventsListCell from '../components/eventsListCell';
import * as commonColors from '../../styles/commonColors';
import  * as commonStyles from '../../styles/commonStyles';

import UtilService from '../../components/util'
import bendService from '../../bend/bendService'
import Cache from '../../components/Cache'

class RecentView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      isRefreshing: false,
      loading: true,
      currentLocation: null,
      activities: {
        event: [],
        service: [],
        action: [],
        volunteer_opportunity: [],
        business: [],
      },
    };
  }

  componentDidMount() {
    this.loadAllData();
    UtilService.mixpanelEvent("Browsed Recent Activity")
  }

  loadAllData() {
    this.setState({
      currentLocation: null,
      loading: true,
      activities: {
        event: [],
        service: [],
        action: [],
        volunteer_opportunity: [],
        business: [],
      },
    });

    navigator.geolocation.getCurrentPosition( 
      (position) => {
        this.search(position)
      },
      (error) => {
        console.log(JSON.stringify(error));
        this.search(null)
      },
      { enableHighAccuracy: commonStyles.geoLocation.enableHighAccuracy, timeout: commonStyles.geoLocation.timeout, maximumAge: commonStyles.geoLocation.maximumAge }
    );
  }

  search(position) {
    if(position) {
      this.setState({ currentLocation: position })
    }

    var param = {
      offset: 0,
      limit: 1000
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
    bendService.searchRecentActivity(param, (error, result) => {
      console.log("searchRecentActivity", result)
      this.setState({
        isRefreshing: false,
        loading: false,
      });

      if (error) {
        console.log("search failed", error)
        return
      }

      var activities = result.data;
      this.setState({
        activities: activities,
      })
    })
  }

  onBack() {
    Actions.pop()
  }

  onPressedActionsCell (action) {
    Actions.ActionDetail({
      action: action
    })
  }

  onPressedEventCell (event) {
    Actions.EventDetail({
      event: event
    })
  }

  onPressedServiceCell (service) {
    Actions.ServiceDetail({
      service: service
    })
  }

  onPressedBusinessesCell (business) {
    Actions.BusinessesDetail({
      business: business
    })
  }

  onPressedVolunteerCell (volunteer) {
    Actions.VolunteerDetail({
      volunteer: volunteer
    })
  }

  renderActionsListRow(rowData, sectionID, rowID) {
    
    rowData = rowData.activity;
    const icon = UtilService.getCategoryIconFromSlug(rowData);
    
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ icon }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedActionsCell(rowData) }
      />
    );
  }

  renderBusinessesListRow(rowData, sectionID, rowID) {

    rowData = rowData.activity;
    const icon = UtilService.getCategoryIconFromSlug(rowData);

    return (
      <BusinessesListCell
        title={ rowData.name }
        icon={ icon }
        description={ rowData.description }
        distance={ rowData._geoloc&&this.state.currentLocation ? UtilService.getDistanceFromLatLonInMile(rowData._geoloc[1], rowData._geoloc[0],
        this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude) : null }
        price={ Number(rowData.priceTier) }
        rating={ Number(rowData.rating || 0) }
        onClick={ () => this.onPressedBusinessesCell(rowData) }
      />
    );
  }

  renderEventsListRow(rowData, sectionID, rowID) {

    rowData = rowData.activity;
    const icon = UtilService.getCategoryIconFromSlug(rowData);

    return (
      <EventsListCell
        title={ rowData.name }
        icon={ icon }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedEventCell(rowData) }
      />
    );
  }

  renderVolunteerListRow(rowData, sectionID, rowID) {

    rowData = rowData.activity;
    const icon = UtilService.getCategoryIconFromSlug(rowData);

    return (
      <EventsListCell
        title={ rowData.name }
        icon={ icon }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedActionsCell(rowData) }
      />
    );
  }

  renderServicesListRow(rowData, sectionID, rowID) {

    rowData = rowData.activity;
    const icon = UtilService.getCategoryIconFromSlug(rowData);

    return (
      <EventsListCell
        title={ rowData.name }
        icon={ icon }
        points={ Math.max(Number(rowData.points || 1), 1) }
        onClick={ () => this.onPressedE(rowData) }
      />
    );
  }

  get showActions() {
    return(
      this.state.activities.action.length ?
        <View>
          <View style={ styles.sectionHeaderContainer }>
            <Text style={ styles.textSectionTitle }>Actions</Text>
          </View>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.activities.action) }
            renderRow={ this.renderActionsListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }/>
        </View>
      :
        null
    );
  }

  get showBusinesses() {
    return (
      this.state.activities.business.length ?
        <View>
          <View style={ styles.sectionHeaderContainer }>
            <Text style={ styles.textSectionTitle }>Businesses</Text>
          </View>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.activities.business) }
            renderRow={ this.renderBusinessesListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }/>
        </View>
      :
        null
    );
  }

  get showEvents() {
    return (
      this.state.activities.event.length ?
        <View>
          <View style={ styles.sectionHeaderContainer }>
            <Text style={ styles.textSectionTitle }>Events</Text>
          </View>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.activities.event) }
            renderRow={ this.renderEventsListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }
          />
        </View>
      :
        null
    );
  }

  get showVolunteer() {
    return (
      this.state.activities.volunteer_opportunity.length ?
        <View>
          <View style={ styles.sectionHeaderContainer }>
            <Text style={ styles.textSectionTitle }>Volunteer Opportunities</Text>
          </View>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.activities.volunteer_opportunity) }
            renderRow={ this.renderVolunteerListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }
          />
        </View>
      :
        null
    );
  }

  get showServices() {
    return (
      this.state.activities.service.length ?
        <View>
          <View style={ styles.sectionHeaderContainer }>
            <Text style={ styles.textSectionTitle }>Services</Text>
          </View>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.activities.service) }
            renderRow={ this.renderServicesListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }
          />
        </View>
      :
        null
    );
  }

  get showActivity() {
    return (
      <ActivityIndicator
        hidesWhenStopped={ true }
        animating={ !this.state.isRefreshing && this.state.loading }
        style={ styles.activityIndicator }
      />
    );
  }


  onRefresh() {
    this.setState({ isRefreshing: true });
    this.loadAllData();    
  }

  render() {
    return (
      <View style={ styles.container }>
        <NavTitleBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          title={ 'Recent' }
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
          { this.showActions }
          { this.showBusinesses }
          { this.showEvents }
          { this.showVolunteer }
          { this.showServices }
          { this.showActivity }
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
)(RecentView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },

  sectionHeaderContainer: {
    flexDirection: 'row',
  },
  textSectionTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    marginTop: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  activityIndicator: {
    marginTop: 10,
    flex: 1,
  },
});
