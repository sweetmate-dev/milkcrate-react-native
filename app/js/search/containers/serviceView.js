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

import NavSearchBar from '../../components/navSearchBar';

import UtilService from '../../components/util'
import bendService from '../../bend/bendService'

import BusinessesListCell from '../components/businessesListCell';
import EventsListCell from '../components/eventsListCell';

import * as commonColors from '../../styles/commonColors';
import  * as commonStyles from '../../styles/commonStyles';

import LoadMoreSpinner from '../../components/loadMoreSpinner';

class ServiceView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.offset = 0;
    this.limit = 20;
    this.searchText = '';
    this.more = true;

    this.state = {
      currentLocation: null,
      services: [],
      categoryIcons:[],
      serviceQuery:{
        more: true,
        loading: false,
      },
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_action_request') {

    } else if (newProps.status == 'search_action_success') {

    } else if (newProps.status == 'search_action_error') {

    }
  }

  componentDidMount() {

    this.loadList();
  }

  onBack() {
    Actions.pop()
  }

  onPressedCell (service) {
    Actions.ServiceDetail({
      service:service
    })
  }

  loadList () {

    if (this.more == false)
      return;

    this.setState( (state) => {  
      state.serviceQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          type:'service',
          offset: this.offset,
          limit: this.limit,
          query: this.searchText,
          lat: position.latitude,
          long: position.longitude
        }, (error, result) => {
          
          this.setState( (state) => {  
            state.serviceQuery.loading = false;
            return state;
          });

          if (error) {
            console.log("search failed", error)
            return
          } 

          if (result.data.service.length < this.limit) {
            this.more = false;
            this.setState( (state) => {  
              state.serviceQuery.more = false;
              return state;
            });
          }

          this.state.services = this.state.services.concat(result.data.service);
          this.setState({ services: this.state.services });

          const imageOffset = this.offset;
          this.offset += this.limit;

          result.data.service.map((service, index) => {
            if (service.categories && service.categories.length > 0) {
              bendService.getCategory(service.categories[0], (error, result)=>{

                if (error){
                  console.log(error);
                  return
                }
                this.setState( (state) => {
                  state.categoryIcons[imageOffset + index] = UtilService.getCategoryIcon(result.slug);
                  return state;
                });
              })
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
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.categoryIcons[rowID] }
        points={ Math.max(rowData.points||1, 1) }
        onClick={ () => this.onPressedCell(rowData) }
      />
    );
  }

  onSearchChange(text) {

    // if (text === '') {
    //   this.onSearchFocus();
    //   return;
    // }

    this.offset = 0;
    this.searchText = text;      
    this.more = true;

    this.setState( (state) => {
      state.serviceQuery.more = true;
      state.categoryIcons = [];
      return state;
    })

    this.loadList();
  }

  // onSearchFocus() {

  //   this.offset = 0;
  //   this.more = false;
  //   this.actions = [];

  //   this.setState( (state) => {
  //     state.serviceQuery.more = false;
  //     state.services = [];
  //     state.categoryIcons = [];
  //     return state;
  //   })
  // }

  onSearchCancel() {

    this.offset = 0;
    this.searchText = '';
    this.more = true;

    this.setState( (state) => {
      state.serviceQuery.more = true;
      state.services = [];
      state.categoryIcons = [];
      return state;
    })

    this.loadList();
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
          placeholder={ 'Search services' }
          onSearchChange={ (text) => this.onSearchChange(text) }
          onCancel={ () => this.onSearchCancel() }
        />
        <ScrollView>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.services) }
            renderRow={ this.renderListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }/>
          <LoadMoreSpinner
            show={ this.state.serviceQuery.more }
            loading={ this.state.serviceQuery.loading }
            onClick={ ()=> this.loadList() }
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
)(ServiceView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },
});
