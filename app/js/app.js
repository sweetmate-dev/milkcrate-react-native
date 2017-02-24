import React, {Component} from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {Actions, Scene, Router} from 'react-native-router-flux';

import * as reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import Introduce from './introduce/containers/introduce';
import Login from './login/containers/login';
import Main from './main/containers/main';
import Search from './search/containers/search';
import SearchView from './search/containers/searchView';
import Events from './search/containers/events'

const scenes = Actions.create(
    <Scene key="root">
      <Scene key="Introduce" component={ Introduce } />
      <Scene key="Login" component={ Login }/>
      <Scene key="Main" component={ Main } initial={ true }/>
      <Scene key="Search" component={ Search } />
      <Scene key="SearchView" component={ SearchView }  />
      <Scene key="Events" component={ Events } />
    </Scene>
);

export default class App extends Component {

  render() {
    return (
      <Provider store={ store }>
        <Router hideNavBar={ true } scenes={ scenes }/>
      </Provider>
    );
  }
}
