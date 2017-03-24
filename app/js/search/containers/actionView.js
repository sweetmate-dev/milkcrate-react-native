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

class ActionView extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      currentLocation: null,
      actions: [],
      avatarImages:[],
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_action_request') {

    } else if (newProps.status == 'search_action_success') {

    } else if (newProps.status == 'search_action_error') {

    }
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition( (position) => {

        this.setState({ currentLocation: position })

        bendService.searchActivity({
          type:'action',
          offset: 0,
          limit: 20,
          lat: position.latitude,
          long: position.longitude
        }, (error, result) => {

          if (error) {
            console.log("search failed", error)
            return
          }
          console.log("search result", result)

          this.setState({
            actions: result.data.action
          })
          result.data.action.map((action, index) => {
            if (action.categories && action.categories.length > 0) {
              bendService.getCategory(action.categories[0], (error, result)=>{
                
                if (error){
                  console.log(error);
                  return
                }
                this.setState( (state) => {
                  state.avatarImages[index] = UtilService.getCategoryImage(result.slug);
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

  onBack() {
    Actions.pop()
  }

  onPressedActionsCell (action) {
    Actions.ActionDetail({
      action:action
    })
  }

  renderActionsListRow(rowData, sectionID, rowID) {
    return (
      <EventsListCell
        title={ rowData.name }
        avatar={ this.state.avatarImages[rowID] }
        coins={ rowData.points }
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