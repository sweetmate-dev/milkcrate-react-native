import React, { Component } from 'react';
import {
  Linking,
  Alert,
} from 'react-native';

import DeepLinking from 'react-native-deep-linking';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';

import * as reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import Introduce from './introduce/containers/introduce';
import Login from './login/containers/login';
import Main from './main/containers/main';
import SearchView from './search/containers/searchView';
import Events from './search/containers/events'

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="Introduce" component={ Introduce } />
    <Scene key="Login" component={ Login } />
    <Scene key="Main" component={ Main } type={ ActionConst.RESET } initial/>
    <Scene key="SearchView" component={ SearchView } />
    <Scene key="Events" component={ Events } />
  </Scene>
);

//Deep Links
const deepLink_Generals = [
  { url: '/introduce', action: Actions.Introduce },
  { url: '/login', action: Actions.Login },
  { url: '/main', action: Actions.Main, parameters: { tab: 'home', }},
  { url: '/home', action: Actions.Main, parameters: { tab: 'home', }},
  { url: '/search', action: Actions.Main, parameters: { tab: 'search', }},
  { url: '/alert', action: Actions.Main, parameters: { tab: 'alert', }} ,
  { url: '/you', action: Actions.Main, parameters: { tab: 'you', }},
];

const deepLink_Search_Activities = [
  { url: '/search/recent', action: Actions.Main, parameters: { tab: 'search', subOne: 'recent', }},
  { url: '/search/businesses', action: Actions.Main, parameters: { tab: 'search', subOne: 'businesses', }},
  { url: '/search/services', action: Actions.Main, parameters: { tab: 'search', subOne: 'services', }},
  { url: '/search/actions', action: Actions.Main, parameters: { tab: 'search', subOne: 'actions', }},
  { url: '/search/volunteer', action: Actions.Main, parameters: { tab: 'search', subOne: 'volunteer', }},
  { url: '/search/events', action: Actions.Main, parameters: { tab: 'search', subOne: 'events', }},
];

const deepLink_Search_Categories = [
  { url: '/search/fashion', action: Actions.Main, parameters: { tab: 'search', subOne: 'fashion', }},
  { url: '/search/books', action: Actions.Main, parameters: { tab: 'search', subOne: 'books', }},
  { url: '/search/business', action: Actions.Main, parameters: { tab: 'search', subOne: 'business', }},
  { url: '/search/cleaning', action: Actions.Main, parameters: { tab: 'search', subOne: 'cleaning', }},
  { url: '/search/animals', action: Actions.Main, parameters: { tab: 'search', subOne: 'animals', }},
  { url: '/search/baby', action: Actions.Main, parameters: { tab: 'search', subOne: 'baby', }},
  { url: '/search/beauty', action: Actions.Main, parameters: { tab: 'search', subOne: 'beauty', }},
  { url: '/search/bicycles', action: Actions.Main, parameters: { tab: 'search', subOne: 'bicycles', }},
  { url: '/search/civic', action: Actions.Main, parameters: { tab: 'search', subOne: 'civic', }},
  { url: '/search/coffee', action: Actions.Main, parameters: { tab: 'search', subOne: 'coffee', }},
  { url: '/search/construction', action: Actions.Main, parameters: { tab: 'search', subOne: 'construction', }},
  { url: '/search/community', action: Actions.Main, parameters: { tab: 'search', subOne: 'community', }},
  { url: '/search/dining', action: Actions.Main, parameters: { tab: 'search', subOne: 'dining', }},
  { url: '/search/drinks', action: Actions.Main, parameters: { tab: 'search', subOne: 'drinks', }},
  { url: '/search/education', action: Actions.Main, parameters: { tab: 'search', subOne: 'education', }},
  { url: '/search/energy', action: Actions.Main, parameters: { tab: 'search', subOne: 'energy', }},
  { url: '/search/fashion', action: Actions.Main, parameters: { tab: 'search', subOne: 'fashion', }},
  { url: '/search/finance', action: Actions.Main, parameters: { tab: 'search', subOne: 'finance', }},
  { url: '/search/food', action: Actions.Main, parameters: { tab: 'search', subOne: 'food', }},
  { url: '/search/garden', action: Actions.Main, parameters: { tab: 'search', subOne: 'garden', }},
  { url: '/search/green_space', action: Actions.Main, parameters: { tab: 'search', subOne: 'green space', }},
  { url: '/search/health_wellness', action: Actions.Main, parameters: { tab: 'search', subOne: 'health & wellness', }},
  { url: '/search/home', action: Actions.Main, parameters: { tab: 'search', subOne: 'home', }},
  { url: '/search/media_communications', action: Actions.Main, parameters: { tab: 'search', subOne: 'media & communications', }},
  { url: '/search/special_events', action: Actions.Main, parameters: { tab: 'search', subOne: 'special events', }},
  { url: '/search/tourism_hospitality', action: Actions.Main, parameters: { tab: 'search', subOne: 'tourism & hospitality', }},
  { url: '/search/transit', action: Actions.Main, parameters: { tab: 'search', subOne: 'transit', }},
  { url: '/search/waste', action: Actions.Main, parameters: { tab: 'search', subOne: 'waste', }},
  { url: '/search/service', action: Actions.Main, parameters: { tab: 'search', subOne: 'service', }},
  { url: '/search/vet', action: Actions.Main, parameters: { tab: 'search', subOne: 'vet', }},
  { url: '/search/groups', action: Actions.Main, parameters: { tab: 'search', subOne: 'groups', }},
  { url: '/search/wares', action: Actions.Main, parameters: { tab: 'search', subOne: 'wares', }},
];

export default class App extends Component {

  deepLinks () {

    DeepLinking.addScheme('milkcrate://');
    Linking.addEventListener('url', DeepLinking.handleUrl);

    deepLink_Generals.forEach((link) => {
      DeepLinking.addRoute(link.url, ({ scheme, path }) => {
        link.action( link.parameters );
      });
    });

    deepLink_Search_Activities.forEach((link) => {
      DeepLinking.addRoute(link.url, ({ scheme, path }) => {
        link.action( link.parameters );
      });
    });

    deepLink_Search_Categories.forEach((link) => {
      DeepLinking.addRoute(link.url, ({ scheme, path }) => {
        link.action( link.parameters );
      });
    });


    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url.toLowerCase());
      }
    }).catch(err => {
      console.error('An error occurred', err)
    });
  }

  componentDidMount() {

    this.deepLinks();
  }

  componentWillUnmount() {

    Linking.removeEventListener('url', DeepLinking.handleUrl);
  }

  render() {
    return (
      <Provider store={ store }>
        <Router hideNavBar={ true } scenes={ scenes }/>
      </Provider>
    );
  }
}
