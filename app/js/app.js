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

const scenes = Actions.create(
    <Scene key="root">
      <Scene key="Introduce" component={ Introduce } title="Introduce" initial={ true }/>
      <Scene key="Login" component={ Login } title="Login"/>
      <Scene key="Main" component={ Main } />
      <Scene key="Search" component={ Search } />
      <Scene key="SearchView" component={ SearchView }  />

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
