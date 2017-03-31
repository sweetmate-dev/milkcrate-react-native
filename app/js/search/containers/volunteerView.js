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
  RefreshControl,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as searchActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import NavSearchBar from '../../components/navSearchBar';

import UtilService from '../../components/util'
import bendService from '../../bend/bendService'

import EventsListCell from '../components/eventsListCell';

import * as commonColors from '../../styles/commonColors';
import  * as commonStyles from '../../styles/commonStyles';

import LoadMoreSpinner from '../../components/loadMoreSpinner';

class VolunteerView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.offset = 0;
    this.limit = 20;
    this.searchText = '';
    this.more = true;

    this.state = {
      isRefreshing: false,

      currentLocation: null,
      volunteeres: [],
      categoryIcons: [],
      volunteeresQuery: {
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

    this.loadAllData();    
  }

  loadAllData() {

    this.offset = 0;
    this.limit = 20;
    this.searchText = '';
    this.more = true;

    this.setState({
      currentLocation: null,
      volunteeres: [],
      categoryIcons: [],
      volunteeresQuery: {
        more: true,
        loading: false,
      },
    });

    this.loadVolunteer();
  }

  onBack() {
    Actions.pop()
  }

  onPressedCell (volunteer) {
    Actions.VolunteerDetail({
      volunteer:volunteer
    })
  }

  loadVolunteer () {

    if (this.more == false)
      return;

    this.setState( (state) => {  
      state.volunteeresQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          type:'volunteer_opportunity',
          offset: this.offset,
          limit: this.limit,
          query: this.searchText
        }, (error, result) => {
          
          this.setState( (state) => {  
            state.volunteeresQuery.loading = false;
            return state;
          });

          this.setState({ isRefreshing: false });

          if (error) {
            console.log("search failed", error)
            return
          } 

          if (result.data.volunteer_opportunity.length < this.limit) {
            this.more = false;
            this.setState( (state) => {  
              state.volunteeresQuery.more = false;
              return state;
            });
          }

          this.state.volunteeres = this.state.volunteeres.concat(result.data.volunteer_opportunity);
          this.setState({ volunteeres: this.state.volunteeres });

          const imageOffset = this.offset;
          this.offset += this.limit;

          result.data.volunteer_opportunity.map((item, index) => {
            if (item.categories && item.categories.length > 0) {
              var category = UtilService.getCategoryById(item.categories[0])
              this.setState( (state) => {
                state.categoryIcons[imageOffset + index] = UtilService.getCategoryIcon(category.slug);
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
      state.volunteeresQuery.more = true;
      state.categoryIcons = [];
      return state;
    })

    this.loadVolunteer();
  }

  onSearchCancel() {

    this.offset = 0;
    this.searchText = '';
    this.more = true;

    this.setState( (state) => {
      state.volunteeresQuery.more = true;
      state.volunteeres = [];
      state.categoryIcons = [];
      return state;
    })

    this.loadVolunteer();
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
          placeholder={ 'Search actions' }
          onSearchChange={ (text) => this.onSearchChange(text) }
          onCancel={ () => this.onSearchCancel() }
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
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.volunteeres) }
            renderRow={ this.renderListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }/>
          <LoadMoreSpinner
            show={ this.state.volunteeresQuery.more }
            loading={ this.state.volunteeresQuery.loading }
            onClick={ ()=> this.loadVolunteer() }
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
)(VolunteerView);

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
