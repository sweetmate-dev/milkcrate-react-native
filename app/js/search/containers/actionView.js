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
import EventsListCell from '../components/eventsListCell';
import LoadMoreSpinner from '../../components/loadMoreSpinner';
import * as commonColors from '../../styles/commonColors';
import  * as commonStyles from '../../styles/commonStyles';

import UtilService from '../../components/util'
import bendService from '../../bend/bendService'

class ActionView extends Component {
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
      actions: [],
      categoryIcons: [],

      actionsQuery: {
        more: true,
        loading: false,
      },
    };
  }

  componentDidMount() {
    this.loadAllData();
  }

  onBack() {
    Actions.pop()
  }

  onPressedActionsCell (action) {
    Actions.ActionDetail({
      action: action
    })
  }

  loadAllData() {
    this.offset = 0;
    this.limit = 20;
    this.searchText = '';
    this.more = true;

    this.setState({
      currentLocation: null,
      actions: [],
      categoryIcons: [],
      actionsQuery: {
        more: true,
        loading: false,
      },
    });

    this.loadActions();
  }

  loadActions () {
    if (this.more == false)
      return;

    this.setState( (state) => {  
      state.actionsQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          type: 'action',
          offset: this.offset,
          limit: this.limit,
          query: this.searchText
        }, (error, result) => {
          
          this.setState( (state) => {  
            state.actionsQuery.loading = false;
            return state;
          });

          this.setState({ isRefreshing: false });

          if (error) {
            console.log("search failed", error)
            return
          } 

          if (result.data.action.length < this.limit) {
            this.more = false;
            this.setState( (state) => {  
              state.actionsQuery.more = false;
              return state;
            });
          }

          this.state.actions = this.state.actions.concat(result.data.action);
          this.setState({ actions: this.state.actions });

          const imageOffset = this.offset;
          this.offset += this.limit;

          result.data.action.map( (action, index) => {
            if (action.categories && action.categories.length > 0) {
              var category = UtilService.getCategoryById(action.categories[0])
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

  renderActionsListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.categoryIcons[rowID] }
        points={ Math.max(rowData.points || 1, 1) }
        onClick={ () => this.onPressedActionsCell(rowData) }
      />
    );
  }

  onSearchChange(text) {
    this.offset = 0;
    this.searchText = text;      
    this.more = true;

    this.setState( (state) => {
      state.actionsQuery.more = true;
      state.categoryIcons = [];
      return state;
    })

    this.loadActions();
  }

  onSearchCancel() {
    this.offset = 0;
    this.searchText = '';
    this.more = true;

    this.setState( (state) => {
      state.actionsQuery.more = true;
      state.actions = [];
      state.categoryIcons = [];
      return state;
    })

    this.loadActions();
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
          placeholder={ 'Search for actions' }
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
            dataSource={ this.dataSource.cloneWithRows(this.state.actions) }
            renderRow={ this.renderActionsListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }
          />
          <LoadMoreSpinner
            show={ this.state.actionsQuery.more }
            loading={ this.state.actionsQuery.loading }
            onClick={ ()=> this.loadActions() }
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
)(ActionView);

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
