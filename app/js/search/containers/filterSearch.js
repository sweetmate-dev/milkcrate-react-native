'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import UtilService from '../../components/util'
import bendService from '../../bend/bendService'

import BusinessesListCell from '../components/businessesListCell';
import EventsListCell from '../components/eventsListCell';

import * as commonColors from '../../styles/commonColors';
import  * as commonStyles from '../../styles/commonStyles';

class FilterSearch extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      currentLocation: null,
      activities: {
        event: [],
        service: [],
        action: [],
        volunteer_opportunity: [],
        business:[],
      },
      icons: {
        event: [],
        service: [],
        action: [],
        volunteer_opportunity: [],
        business:[],
      }
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }

    if (newProps.searchText != this.props.searchText) {
      this.getActivities(newProps.searchText);
    }
  }

  getActivityIcons(activities) {

    this.setState( (state) => {
      state.icons.event = [];
      state.icons.service = [];
      state.icons.action = [];
      state.icons.volunteer_opportunity = [];
      state.icons.business = [];
      return state;
    });

    //event icons
    activities.event.map((event, index) => {
      if (event.categories && event.categories.length > 0) {
        bendService.getCategory(event.categories[0], (error, result)=>{

          if (error){
            console.log(error);
            return
          }
          this.setState( (state) => {
            state.icons.event[index] = UtilService.getCategoryIcon(result.slug);
            return state;
          });
        })
      }
    });

    //service icons
    activities.service.map((service, index) => {
      if (service.categories && service.categories.length > 0) {
        bendService.getCategory(service.categories[0], (error, result)=>{

          if (error){
            console.log(error);
            return
          }
          this.setState( (state) => {
            state.icons.service[index] = UtilService.getCategoryIcon(result.slug);
            return state;
          });
        })
      }
    });

    //action icons
    activities.action.map((action, index) => {
      if (action.categories && action.categories.length > 0) {
        bendService.getCategory(action.categories[0], (error, result)=>{

          if (error){
            console.log(error);
            return
          }
          this.setState( (state) => {
            state.icons.action[index] = UtilService.getCategoryIcon(result.slug);
            return state;
          });
        })
      }
    });

    //volunteer_opportunity icons
    activities.volunteer_opportunity.map((volunteer_opportunity, index) => {
      if (volunteer_opportunity.categories && volunteer_opportunity.categories.length > 0) {
        bendService.getCategory(volunteer_opportunity.categories[0], (error, result)=>{

          if (error){
            console.log(error);
            return
          }
          this.setState( (state) => {
            state.icons.volunteer_opportunity[index] = UtilService.getCategoryIcon(result.slug);
            return state;
          });
        })
      }
    });

    //business icons
    activities.business.map((business, index) => {
      if (business.categories && business.categories.length > 0) {
        bendService.getCategory(business.categories[0], (error, result)=>{

          if (error){
            console.log(error);
            return
          }
          this.setState( (state) => {
            state.icons.business[index] = UtilService.getCategoryIcon(result.slug);
            return state;
          });
        })
      }
    });
  }

  getActivities(searchText) {

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          query: searchText,
          lat: position.latitude,
          long: position.longitude
        }, (error, result) => {

          if (error) {
            console.log("search failed", error);
            return
          }

          var activities = result.data;
          this.setState({ activities: activities });
          this.getActivityIcons(activities);
        })
      },
      (error) => {
        console.log(JSON.stringify(error));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }
  onPressedActionsCell (action) {
    Actions.ActionDetail({
      action:action
    })
  }

  onPressedBusinessesCell (business) {
    Actions.BusinessesDetail({
      business:business
    })
  }

  onPressedEventCell (event) {
    Actions.EventDetail({
      event:event
    })
  }

  onPressedServiceCell (service) {
  Actions.ServiceDetail({
    service:service
  })
}

  renderActionsListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.icons.action[rowID] }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedActionsCell(rowData) }
      />
    );
  }

  renderBusinessesListRow(rowData, sectionID, rowID) {
    return (
      <BusinessesListCell
        title={ rowData.name }
        icon={ this.state.icons.business[rowID] }
        description={ rowData.description }
        distance={ rowData._geoloc && this.state.currentLocation ? UtilService.getDistanceFromLatLonInMile(rowData._geoloc[1], rowData._geoloc[0],
        this.state.currentLocation.coords.latitude, this.state.currentLocation.coords.longitude) : 1.0 }
        price={ Number(rowData.priceTier) }
        rating={ Number(rowData.rating || 0)}
        onClick={ () => this.onPressedBusinessesCell(rowData) }
      />
    );
  }

  renderEventsListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.icons.event[rowID] }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedEventCell(rowData) }
      />
    );
  }

  renderVolunteerListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.icons.volunteer_opportunity[rowID] }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedActionsCell(rowData) }
      />
    );
  }

  renderServicesListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.icons.service[rowID] }
        points={ Math.max(Number(rowData.points || 1), 1) }
        onClick={ () => this.onPressedServiceCell(rowData) }
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
            contentContainerStyle={ styles.listViewWrapper }/>

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
            contentContainerStyle={ styles.listViewWrapper }/>

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
            contentContainerStyle={ styles.listViewWrapper }/>
        </View>
      :
        null
    );
  }

  render() {
    const { status } = this.props;

    return (
      <ScrollView>
        { this.showActions }
        { this.showBusinesses }
        { this.showEvents }
        { this.showVolunteer }
        { this.showServices }
      </ScrollView>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(searchActions, dispatch)
  })
)(FilterSearch);

const styles = StyleSheet.create({
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

});
