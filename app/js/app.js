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
import UtilService from './components/util'
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
            UtilService.deepLinks();

          UtilService.mixpanelEvent("Logged In", {"name":activeUser.name})
      }
    });

      //initial mix setting, sets in first time
      /*this.mixSetting = {
          "Total Sessions": 0,
          "Last Session Date": null,
          "Total Looks Snapped": 0,
          "Last Snap Date": null,
          "Has Snapped": false,
          "Total Looks Scanned": 0,
          "Total Photos Uploaded":0,
          "Last Scan Date": null,
          "Has Scanned": false,
          "Last Look Detail View": null,
          "Total Products Viewed": 0,
          "Has Viewed Product": false,
          "Last Product Viewed": null,
          "Camera Permission Granted": false,
          "Photo Library Permission Granted": false,
      };
      Mixpanel.registerSuperPropertiesOnce(this.mixSetting);*/
  }

  componentDidMount() {
    Linking.addEventListener('url', ({ url }) => {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          if (url.includes('?q=')) {
            url = url.replace(/\?q=/gi, '/');
          }

          console.log('handleUrl : ', url);
          var defaultLink = 'milkcrate://search';
          if(defaultLink == url) {
            defaultLink = 'milkcrate://profile'
          }
          setTimeout(()=>{
            DeepLinking.evaluateUrl(url);
          }, 50)
          DeepLinking.evaluateUrl(defaultLink);
        }
      });
    });

    Linking.getInitialURL().then((url) => {
      if (url) {
        Linking.openURL(url.toLowerCase());
      }
    }).catch(error => {
      console.error('An error occurred', error)
    });

      UtilService.mixpanelEvent("Launched the app")
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', DeepLinking.handleUrl);
  }

  render() {

    if (this.state.initialize === false )
      return null;

    const scenes = Actions.create(
      <Scene key="root">
        <Scene key="Introduce" component={ Introduce } type={ ActionConst.RESET } />
        <Scene key="Main" component={ Main } initial={ this.state.loggedIn }/>
        <Scene key="Signup" component={ Signup } />
        <Scene key="Login" component={ Login } />
        <Scene key="SetupProfile" component={ SetupProfile } />
        <Scene key="BusinessesView" component={ BusinessesView } />
        <Scene key="CategoryView" component={ CategoryView } />
        <Scene key="RecentView" component={ RecentView } />
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
        <Scene key="ActionDetail" component={ ActionDetail } />
        <Scene key="BusinessesDetail" component={ BusinessesDetail } />
        <Scene key="EventDetail" component={ EventDetail } />
        <Scene key="ServiceDetail" component={ ServiceDetail } />
        <Scene key="VolunteerDetail" component={ VolunteerDetail } />
        <Scene key="ActionDetailModal" component={ ActionDetail } direction='vertical' />
        <Scene key="BusinessesDetailModal" component={ BusinessesDetail } direction='vertical' />
        <Scene key="EventDetailModal" component={ EventDetail } direction='vertical' />
        <Scene key="ServiceDetailModal" component={ ServiceDetail } direction='vertical' />
        <Scene key="VolunteerDetailModal" component={ VolunteerDetail } direction='vertical' />
        <Scene key="VideoPlayModal" component={ VideoPlayModal } direction='vertical' />
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
