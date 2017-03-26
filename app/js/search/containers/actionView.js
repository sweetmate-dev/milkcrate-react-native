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

class ActionView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      currentLocation: null,
      actions: [],
      categoryImages:[],
      actionsQuery:{
        offset: 0,
        limit: 20,
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

    this.loadActions();
  }

  onBack() {
    Actions.pop()
  }

  onPressedActionsCell (action) {
    Actions.ActionDetail({
      action:action
    })
  }

  loadActions () {

    if (this.state.actionsQuery.more === false)
      return;

    this.setState( (state) => {  
      state.actionsQuery.loading = true;
      return state;
    });

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          type:'action',
          offset: this.state.actionsQuery.offset,
          limit: this.state.actionsQuery.limit,
          lat: position.latitude,
          long: position.longitude
        }, (error, result) => {

          this.setState( (state) => {  
            state.actionsQuery.loading = false;
            return state;
          });

          if (error) {
            console.log("search failed", error)
            return
          }

          if (result.data.action.length < this.state.actionsQuery.limit) {
            this.setState( (state) => {  
              state.actionsQuery.more = false;
              return state;
            });
          }

          const imageOffset = this.state.actionsQuery.offset;

          this.setState( (state) => {
            state.actions = state.actions.concat(result.data.action);
            state.actionsQuery.offset += this.state.actionsQuery.limit;
            return state;
          })

          result.data.action.map((action, index) => {
            if (action.categories && action.categories.length > 0) {
              bendService.getCategory(action.categories[0], (error, result)=>{

                if (error){
                  console.log(error);
                  return
                }
                this.setState( (state) => {
                  state.categoryImages[imageOffset + index] = UtilService.getCategoryIcon(result.slug);
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

  renderActionsListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        icon={ this.state.categoryImages[rowID] }
        points={ Math.max(rowData.points||1, 1) }
        onClick={ () => this.onPressedActionsCell(rowData) }
      />
    );
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar
          buttons={ commonStyles.NavBackButton }
          onBack={ this.onBack }
        />
        <ScrollView>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSource.cloneWithRows(this.state.actions) }
            renderRow={ this.renderActionsListRow.bind(this) }
            contentContainerStyle={ styles.listViewWrapper }/>
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
