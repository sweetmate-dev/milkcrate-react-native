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
  { url: '/introduce', action: Actions.Introduce },
  { url: '/signup', action: Actions.Signup },
  { url: '/main', action: Actions.Main, parameters: { tab: 'home', }},
  { url: '/home', action: Actions.Main, parameters: { tab: 'home', }},
  { url: '/search', action: Actions.Main, parameters: { tab: 'search', }},
  { url: '/alert', action: Actions.Main, parameters: { tab: 'alert', }} ,
  { url: '/profile', action: Actions.Main, parameters: { tab: 'you', }},
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
  { url: '/search/green-space', action: Actions.Main, parameters: { tab: 'search', subOne: 'green-space', }},
  { url: '/search/health-wellness', action: Actions.Main, parameters: { tab: 'search', subOne: 'health-wellness', }},
  { url: '/search/home', action: Actions.Main, parameters: { tab: 'search', subOne: 'home', }},
  { url: '/search/media-communications', action: Actions.Main, parameters: { tab: 'search', subOne: 'media-communications', }},
  { url: '/search/products', action: Actions.Main, parameters: { tab: 'search', subOne: 'products', }},
  { url: '/search/services', action: Actions.Main, parameters: { tab: 'search', subOne: 'services', }},
  { url: '/search/special-events', action: Actions.Main, parameters: { tab: 'search', subOne: 'special-events', }},
  { url: '/search/tourism-hospitality', action: Actions.Main, parameters: { tab: 'search', subOne: 'tourism-hospitality', }},
  { url: '/search/transit', action: Actions.Main, parameters: { tab: 'search', subOne: 'transit', }},
  { url: '/search/waste', action: Actions.Main, parameters: { tab: 'search', subOne: 'waste', }},
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

      if (activeUser && activeUser._id) {
        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
      }
      this.setState({ initialize: true });
    });
  }

  deepLinks () {

    DeepLinking.addScheme('www.mymilkcrate.com://');
    Linking.addEventListener('url', DeepLinking.handleUrl);

    deepLink_General.forEach((link) => {
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

    if (this.state.initialize === false )
      return null;

    const scenes = Actions.create(
      <Scene key="root">
        <Scene key="Introduce" component={ Introduce } />
        <Scene key="Signup" component={ Signup } />
        <Scene key="Login" component={ Login } />
        <Scene key="SetupProfile" component={ SetupProfile }/>
        <Scene key="Main" component={ Main } type={ ActionConst.RESET } initial={ this.state.loggedIn }/>
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
