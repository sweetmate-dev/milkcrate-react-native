import React, { Component } from 'react';
import {
  Linking,
  Alert,
  Platform,
} from 'react-native';

import DeepLinking from 'react-native-deep-linking';
import codePush from "react-native-code-push";
import { Crashlytics } from 'react-native-fabric';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Actions, ActionConst, Scene, Router } from 'react-native-router-flux';

import timer from 'react-native-timer';

import bendService from './bend/bendService'
import * as _ from 'underscore'

import * as reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

import Introduce from './introduce/containers/introduce';
import Signup from './auth/containers/signup';
import Login from './auth/containers/login';
import Main from './main/containers/main';
import BusinessesView from './search/containers/businessesView';
import CategoryView from './search/containers/categoryView';
import RecentView from './search/containers/recentView';
import BusinessesDetail from './search/containers/businessesDetail';
import ActionDetail from './search/containers/actionDetail';
import ServiceDetail from './search/containers/serviceDetail';
import EventDetail from './search/containers/eventDetail';
import EventsView from './search/containers/eventsView';
import SetupProfile from './profile/containers/setupProfile';
import Settings from './profile/containers/settings';
import CommunityPoints from './profile/containers/communityPoints';
import WeeklyRecap from './main/containers/weeklyRecap';
import Leaderboard from './profile/containers/leaderboard';
import EditProfile from './profile/containers/editProfile';
import ChangePassword from './profile/containers/changePassword';
import LearnMoreModal from './home/components/learnMoreModal';
import ActionView from './search/containers/actionView';
import ServiceView from './search/containers/serviceView';
import VolunteerView from './search/containers/volunteerView';
import VolunteerDetail from './search/containers/volunteerDetail';
import VideoPlayModal from './components/videoPlayModal';


//Deep Links
const deepLink_General = [
  // { url: '/introduce', action: Actions.Introduce },
  // { url: '/signup', action: Actions.Signup },
  { url: '/main', parameters: { tab: 'home', }},
  { url: '/home', parameters: { tab: 'home', }},
  { url: '/search', parameters: { tab: 'search', }},
  { url: '/alerts', parameters: { tab: 'alerts', }},
  { url: '/profile', parameters: { tab: 'profile', }},
  { url: '/community', parameters: { tab: 'profile', subOne: 'community',}},
];

const deepLink_Search_Activities = [
  { url: '/search/recent', parameters: { tab: 'search', subOne: 'recent', }},
  { url: '/search/actions', parameters: { tab: 'search', subOne: 'actions', }},
  { url: '/search/businesses', parameters: { tab: 'search', subOne: 'businesses', }},
  { url: '/search/events', parameters: { tab: 'search', subOne: 'events', }},
  { url: '/search/services', parameters: { tab: 'search', subOne: 'services', }},
  { url: '/search/volunteer_opportunities', parameters: { tab: 'search', subOne: 'volunteer_opportunities', }},  
];

const deepLink_Search_Activities_Query = [
  // { url: '/search/recent/:query', parameters: { tab: 'search', subOne: 'recent', }},
  { url: '/search/actions/:query', parameters: { tab: 'search', subOne: 'actions', }},
  { url: '/search/businesses/:query', parameters: { tab: 'search', subOne: 'businesses', }},
  { url: '/search/events/:query', parameters: { tab: 'search', subOne: 'events', }},
  { url: '/search/services/:query', parameters: { tab: 'search', subOne: 'services', }},
  { url: '/search/volunteer_opportunities/:query', parameters: { tab: 'search', subOne: 'volunteer_opportunities', }},  
];

const deepLink_Search_Categories = [
  { url: '/search/animals', parameters: { tab: 'search', subOne: 'animals', }},
  { url: '/search/baby', parameters: { tab: 'search', subOne: 'baby', }},
  { url: '/search/beauty', parameters: { tab: 'search', subOne: 'beauty', }},
  { url: '/search/bicycles', parameters: { tab: 'search', subOne: 'bicycles', }},
  { url: '/search/civic', parameters: { tab: 'search', subOne: 'civic', }},
  { url: '/search/coffee', parameters: { tab: 'search', subOne: 'coffee', }},
  { url: '/search/community', parameters: { tab: 'search', subOne: 'community', }},
  { url: '/search/construction', parameters: { tab: 'search', subOne: 'construction', }},
  { url: '/search/dining', parameters: { tab: 'search', subOne: 'dining', }},
  { url: '/search/drinks', parameters: { tab: 'search', subOne: 'drinks', }},
  { url: '/search/education', parameters: { tab: 'search', subOne: 'education', }},
  { url: '/search/energy', parameters: { tab: 'search', subOne: 'energy', }},
  { url: '/search/fashion', parameters: { tab: 'search', subOne: 'fashion', }},
  { url: '/search/finance', parameters: { tab: 'search', subOne: 'finance', }},
  { url: '/search/food', parameters: { tab: 'search', subOne: 'food', }},
  { url: '/search/garden', parameters: { tab: 'search', subOne: 'garden', }},
  { url: '/search/green_space', parameters: { tab: 'search', subOne: 'green space', }},
  { url: '/search/health_wellness', parameters: { tab: 'search', subOne: 'health & wellness', }},
  { url: '/search/home_office', parameters: { tab: 'search', subOne: 'home & office', }},
  { url: '/search/media_communications', parameters: { tab: 'search', subOne: 'media & communications', }},
  { url: '/search/products', parameters: { tab: 'search', subOne: 'products', }},
  { url: '/search/services', parameters: { tab: 'search', subOne: 'services', }},
  { url: '/search/special_events', parameters: { tab: 'search', subOne: 'special events', }},
  { url: '/search/tourism_hospitality', parameters: { tab: 'search', subOne: 'tourism & hospitality', }},
  { url: '/search/transit', parameters: { tab: 'search', subOne: 'transit', }},
  { url: '/search/waste', parameters: { tab: 'search', subOne: 'waste', }},
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state ={
      initialize: false,
      loggedIn: false,
    };

    bendService.init((err, activeUser)=>{
      console.log("bend init", err, activeUser)

      let loggedInUser;

      if (activeUser && activeUser._id) {
        this.setState({ loggedIn: true });
        loggedInUser = true;
      } else {
        this.setState({ loggedIn: false });
        loggedInUser = false;
      }

      this.setState({ initialize: true });

      if (loggedInUser == true) {
        this.deepLinks();
      }
    });
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    Linking.removeEventListener('url', DeepLinking.handleUrl);
  }

  handleUrl = ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        if (url.includes('?q=')) {
          url = url.replace(/\?q=/gi, '/');
        }        
        DeepLinking.evaluateUrl(url);
      }
    });
  }

  deepLinks () {
    DeepLinking.addScheme('milkcrate://');
    Linking.addEventListener('url', this.handleUrl);

    deepLink_General.forEach((link) => {
      DeepLinking.addRoute(link.url, ({ scheme, path }) => {
        console.log('DeepLinking : ', scheme, path);
        Actions.Main(link.parameters );
      });
    });

    deepLink_Search_Activities.forEach((link) => {
      DeepLinking.addRoute(link.url, ({ scheme, path }) => {
        console.log('DeepLinking : ', scheme, path);
        Actions.Main( link.parameters );
      });
    });

    deepLink_Search_Activities_Query.forEach((link) => {
      DeepLinking.addRoute(link.url , ({ scheme, path, query }) => {
        link.parameters['query'] = query;
        Actions.Main( link.parameters );
      });
    });

    deepLink_Search_Categories.forEach((link) => {
      DeepLinking.addRoute(link.url, ({ scheme, path }) => {
        console.log('DeepLinking : ', scheme, path);
        Actions.Main( link.parameters );
      });
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url.toLowerCase());
      }
    }).catch(error => {
      console.error('An error occurred', error)
    });
  }

  render() {

    if (this.state.initialize === false )
      return null;

    const scenes = Actions.create(
      <Scene key="root">
        <Scene key="Introduce" component={ Introduce } />
        <Scene key="Signup" component={ Signup } />
        <Scene key="Login" component={ Login } />
        <Scene key="SetupProfile" component={ SetupProfile }/>
        <Scene key="Main" component={ Main } initial={ this.state.loggedIn }/>
        <Scene key="BusinessesView" component={ BusinessesView } />
        <Scene key="CategoryView" component={ CategoryView } />
        <Scene key="RecentView" component={ RecentView } />
        <Scene key="BusinessesDetail" component={ BusinessesDetail } />
        <Scene key="ActionDetail" component={ ActionDetail } />
        <Scene key="EventDetail" component={ EventDetail } />
        <Scene key="ServiceDetail" component={ ServiceDetail } />
        <Scene key="EventsView" component={ EventsView } />
        <Scene key="Settings" component={ Settings } />
        <Scene key="CommunityPoints" component={ CommunityPoints } />
        <Scene key="WeeklyRecap" component={ WeeklyRecap } direction='vertical' />
        <Scene key="Leaderboard" component={ Leaderboard } />
        <Scene key="EditProfile" component={ EditProfile } />
        <Scene key="ChangePassword" component={ ChangePassword } />
        <Scene key="LearnMoreModal" component={ LearnMoreModal } direction='vertical' />
        <Scene key="ActionView" component={ ActionView } />
        <Scene key="ServiceView" component={ ServiceView } />
        <Scene key="VolunteerView" component={ VolunteerView } />
        <Scene key="VolunteerDetail" component={ VolunteerDetail } />
        <Scene key="VideoPlayModal" component={ VideoPlayModal } direction='vertical'/>
      </Scene>
    );

    return (
      <Provider store={ store }>
        <Router hideNavBar={ true } scenes={ scenes }/>
      </Provider>
    );
  }
}

export default codePush(App);
