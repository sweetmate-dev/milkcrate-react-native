'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  ListView,
  Linking,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  Alert,
  WebView
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as homeActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as commonActions from '../../common/actions';

import Carousel from 'react-native-snap-carousel';
import timer from 'react-native-timer';

import NavSearchBar from '../../components/navSearchBar';

import ChallengeCarousel from '../components/challengeCarousel';
import TrendingCarousel from '../components/trendingCarousel';
import RecentActivityListCell from '../../components/recentActivityListCell';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DailyPollStateCell from '../components/dailyPollStateCell';
import Point from '../../components/Point';
import FadeInView from '../components/fadeInView';
import FadeOutView from '../components/fadeOutView';
import LoadMoreSpinner from '../../components/loadMoreSpinner';

import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'
import Cache from '../../components/Cache'

import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const trending = require('../../../assets/imgs/trending.png');

const carouselLeftMargin = (commonStyles.carouselerWidth - commonStyles.carouselItemWidth) / 2 - commonStyles.carouselItemHorizontalPadding;

class Home extends Component {
  constructor(props) {
    super(props);

    this.dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      selectedDailyPollValue: '',
      selectedDailyPollIndex: -1,
      selectedDailyPollStateMode: false,
      isRefreshing: false,

      challenges: [],
      community: {},
      categories: [],
      trendings: [],
      pollQuestion:{
        question: {},
        answers: [],
        myAnswer: null,
      },
      recentActivities:[],
      activityQuery:{
        more: true,
        loading: false,
      }
    };

    this.activityQuery = { 
      more: true,
      createdAt: 0, 
      limit: 20
    };
  }

  componentDidMount() {
    this.hasMounted = true
    this.loadAllData();
  }

  componentWillUnmount() {
    this.hasMounted = false
  }

  componentWillReceiveProps(newProps) {
    //console.log("home componentWillReceiveProps", newProps)
    const { commonStatus, likeResult, recentActivityId, recentActivityLike, activityId } = newProps;
    const oldRecentActivityLike = this.props.recentActivityLike;
    
    if (commonStatus === 'recent_activity_like_success') {

      var exist = _.find(this.state.recentActivities, (obj) => {
        return obj._id == recentActivityId;
      })

      if (likeResult && exist) {
        
        if (oldRecentActivityLike != recentActivityLike) {
          exist.likedByMe = recentActivityLike;

          if (recentActivityLike) {
            exist.likeCount = Number(exist.likeCount || 0) + 1;
          } else {
            exist.likeCount = Math.max(Number(exist.likeCount || 0) - 1, 0);
          }

          this.hasMounted&&this.setState({
            recentActivities: this.state.recentActivities
          });
        }
      }
    } else if(commonStatus === 'capture_activity_success') {
      var exist = _.find(this.state.recentActivities, (obj) => {
        return obj._id == activityId;
      })

      if(exist) return;

      //add new recent activity
      bendService.getRecentActivity(activityId, (err, activity)=>{
        if(err) {
          console.log(err);return;
        }

        this.state.recentActivities.unshift(activity);
        this.hasMounted&&this.setState({
          recentActivities:this.state.recentActivities
        })
      })
    } else if(commonStatus === 'remove_activity_success') {
      //console.log("commonStatus", commonStatus, activityId)

      //remove recent activity from list
      var exist = _.find(this.state.recentActivities, (obj) => {
        return obj._id == activityId;
      })

      if(exist) {
        var idx = this.state.recentActivities.indexOf(exist)
        this.state.recentActivities.splice(idx, 1);
        this.hasMounted && this.setState({
          recentActivities:this.state.recentActivities
        })
      }
    } else if (newProps.selectedTab == 'home') {
      //get recent activity again
      this.loadLastActivities();
    }
  }

  loadLastActivities() {
    var lastTime = 0;
    if (this.state.recentActivities.length > 0) {
      lastTime = this.state.recentActivities[0]._bmd.createdAt;
    } else
        return;

    bendService.getLastActivities(lastTime, (error, result)=>{
      if (error) {
        console.log(error);return
      }

      if (result.length > 0) {
        this.state.recentActivities = result.concat(this.state.recentActivities);
        this.hasMounted&&this.setState({
          recentActivities:this.state.recentActivities
        })
      }
    })
  }

  loadAllData() {

    this.hasMounted&&this.setState({
      selectedDailyPollValue: '',
      selectedDailyPollIndex: -1,
      selectedDailyPollStateMode: false,

      challenges: [],
      community: {},
      categories: [],
      trendings: [],
      pollQuestion:{
        question: {},
        answers: [],
        myAnswer: null,
      },
      recentActivities:[],
      activityQuery: {
        more: true,
        loading: false,
      }      
    });

    this.activityQuery = { 
      more: true,
      createdAt: 0, 
      limit: 20 
    };

    bendService.getCategories( (error, result) => {

      if (!error) {
        this.hasMounted&&this.setState({
          categories: result
        })
      }
    })

    bendService.getUser((error, result) => {} )

    bendService.getWeeklyChallenges( "", (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.hasMounted&&this.setState({ challenges: result });
    })

    bendService.getTrending( (error, result) => {

      if (error) {
        console.log(error);
        return;
      }

      this.hasMounted&&this.setState({
        trendings: result
      })
    })

    bendService.getCommunity( (error, result) => {

      if (error) {
        console.log(error);
        return;
      }

      this.hasMounted&&this.setState({
        community: result
      })
    })

    this.loadRecentActivities()

    this.loadPollQuestion()

    /*var currentDate = new Date().setHours(0,0,0,0);
    setInterval(()=>{
      var current = new Date().setHours(0,0,0,0)
      if(current != currentDate) {
        currentDate = current;

        //update poll question
        this.loadPollQuestion();
      }
    }, 1000 * 60 * 10);*/
  }

  loadPollQuestion() {
    bendService.getPollQuestion( (error, question, answers, myAnswer) => {

      if (error) {
        console.log('poll questions erroror', error);
        return;
      }

      this.hasMounted&&this.setState({
        pollQuestion: {
          question: question,
          answers: answers,
          myAnswer: myAnswer
        }
      })
    })
  }

  loadRecentActivities() {

    if ( this.activityQuery.more === false )
      return;

    this.hasMounted&&this.setState( (state) => {
      state.activityQuery.loading = true;
      return state;
    });

    bendService.getRecentActivities(this.activityQuery.createdAt, this.activityQuery.limit + 1, (error, result) => {

      this.hasMounted&&this.setState( (state) => {
        state.activityQuery.loading = false;
        return state;
      });

      this.hasMounted&&this.setState({
        isRefreshing: false,
      });

      if (error) {
        console.log(error);
        return;
      }

      this.activityQuery.more = (result.length == this.activityQuery.limit + 1)

      this.hasMounted&&this.setState((state) => {
        state.activityQuery.more = this.activityQuery.more;
        return state;
      });

      if (this.activityQuery.more) {
        //remove tail item
        result.pop()
      }      
      
      if (result.length > 0) {
        this.state.recentActivities = this.state.recentActivities.concat(result)
        this.activityQuery.createdAt = result[result.length - 1]._bmd.createdAt
        this.hasMounted&&this.setState({
          recentActivities: this.state.recentActivities,
        })
      }

      this.hasMounted&&this.setState({
        activityQuery: this.state.activityQuery
      })

      console.log("activity count", this.state.recentActivities.length);
    })
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {

    return (
      <RecentActivityListCell
        name={ rowData.user.name || '' }
        description={ rowData.summary || '' }
        avatar={ rowData.user.avatar ? UtilService.getSmallImage(rowData.user.avatar) : '' }
        avatarBackColor={ UtilService.getBackColor(rowData.user.avatar) }
        defaultAvatar={ UtilService.getDefaultAvatar(rowData.user.defaultAvatar) }
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        hearts={ Number(rowData.likeCount || 0) }
        likeByMe={ rowData.likedByMe || false }
        points={ Number(rowData.points || 1) }
        onClick={ () => this.onRecentActivityCellPressed(rowData) }
        onLike={ () => this.onLike(rowData, !(rowData.likedByMe || false)) }
      />
    );
  }

  onLike(activity, like) {

    this.props.recentActivityLikeActions.likeRecentActivity(activity, like);
  }

  onRecentActivityCellPressed (activity) {
    if(activity.type == 'business') {
      Actions.BusinessesDetail({ business: activity.activity });
    } else if(activity.type == 'action') {
      Actions.ActionDetail({ action: activity.activity });
    } else if(activity.type == 'event') {
      Actions.EventDetail({ event: activity.activity });
    } else if(activity.type == 'service') {
      Actions.ServiceDetail({ service: activity.activity });
    } else if(activity.type == 'volunteer_opportunity') {
      Actions.VolunteerDetail({ volunteer: activity.activity });
    }
  }

  onLearnMore() {
    Actions.LearnMoreModal({question:this.state.pollQuestion.question});
  }

  goChallenge(activity, type) {

  }

  getChallengeCarousel (entries) {
    return entries.map( (entry, index) => {
      var cat = bendService.getActivityCategory(this.state.categories, entry.activity)
      if(cat == null) return null;
      return (
        <ChallengeCarousel
          key={ index }
          title={ entry.title }
          subtitle={entry.activity.name}
          icon={ UtilService.getCategoryIcon(cat) }
          points={ entry.activity.points ? Math.max(Number(entry.activity.points), 1) : 1 }
          link={ entry.activity.url }
          rawData={ entry }
        />
      );
    });
  }

  getTrendingCarousel (entries) {
    if (!entries || entries.length == 0) {
      return false;
    }

    return entries.map( (entry, index) => {
      let category = bendService.getActivityCategory(this.state.categories, entry)
      if(category == null) return null;
      return (
        <TrendingCarousel
          key={ index }
          type={ UtilService.getTrendTitle(entry.type) }
          activityType={ entry.type }
          activity={ entry }
          title={ entry.name }
          icon={ category ? UtilService.getCategorySticker(category) : require('../../../assets/imgs/category-stickers/transit.png') }
          users={ entry.users }
          userCount={ entry.userCount }
          time={ entry.lastTime }
          hearts={ Number(entry.likeCount || 0) }
          points={ Number(entry.points || 1) }
          rawData={ entry }
        />
      );
    });
  }

  get showChallenges () {
    if (this.state.challenges.length == 0)
      return null;

    return (
      <Carousel
        sliderWidth={ commonStyles.carouselerWidth }
        itemWidth={ commonStyles.carouselItemWidth }
        inactiveSlideScale={ 1 }
        inactiveSlideOpacity={ 1 }
        enableMomentum={ false }
        containerCustomStyle={ styles.slider }
        contentContainerCustomStyle={ styles.sliderContainer }
        showsHorizontalScrollIndicator={ false }
        snapOnAndroid={ true }
        removeClippedSubviews={ false }
      >
        { this.getChallengeCarousel( this.state.challenges ) }
      </Carousel>
    );
  }

  onGoIntroVideo() {
    var url = 'http://311223117dc459c19100-ab7ee833adab3aef56dce40975a8acc5.r73.cf1.rackcdn.com/milkcrate-intro.mp4'
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    }).catch((error)=>{
      //console.log("URL open error");
    });
  }

  get showVideo() {
    var delta = (Date.now() - bendService.getActiveUser()._bmd_createdAt/1000000)/1000;
    
    if (delta > 5 * 3600 * 24) {
      return null;
    }

    return (
      <View style={ styles.trendingContainer }>
        <View style={ styles.trendingTitleContainer }>
          <Text style={ styles.textTitle }>Intro Video</Text>
        </View>
        <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onGoIntroVideo() }>
          <View style={ styles.videoWrapper }>
            <Image style={ styles.imageVideo } source={ require('../../../assets/imgs/vid.png') } />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  get showTrending() {

    return (
    this.state.trendings.length > 0 && <View style={ styles.trendingContainer }>
        <View style={ styles.trendingTitleContainer }>
          <Text style={ styles.textTitle }>Currently Trending</Text>
          <Image style={ styles.imageTrending } source={ trending }/>
        </View>
        {
          this.state.trendings.length > 0 && <Carousel
            sliderWidth={ commonStyles.carouselerWidth }
            itemWidth={ commonStyles.carouselItemWidth }
            inactiveSlideScale={ 1 }
            inactiveSlideOpacity={ 1 }
            enableMomentum={ false }
            containerCustomStyle={ styles.slider }
            contentContainerCustomStyle={ styles.sliderContainer }
            showsHorizontalScrollIndicator={ false }
            snapOnAndroid={ true }
            removeClippedSubviews={ false }
          >
          { this.getTrendingCarousel(this.state.trendings) }
        </Carousel>}
      </View>
    );
  }

  get showMainDailyPollSelectMode() {
    return (
      this.state.selectedDailyPollIndex == -1 ?
        this.showDailyPollSelectMode
        :
        <FadeOutView>
          { this.showDailyPollSelectMode }
        </FadeOutView>
    );
  }

  get showDailyPollSelectMode() {
    return (
      <View style={ styles.dailyPollSelectContentContainer }>
        <RadioForm
          formHorizontal={ false }
          animation={ true }
          style={ styles.radioFormWrapper }
        >
          {
            this.state.pollQuestion.answers.map( (obj, index) => {
              var onPressRadioButton = (value, index) => {
                //console.log(value, index)
                this.hasMounted&&this.setState({
                  selectedDailyPollValue: value,
                  selectedDailyPollIndex: index
                });

                //do polling
                bendService.pollResponse(this.state.pollQuestion.question, this.state.pollQuestion.answers[index], (error, result)=>{
                  if (error) {
                    console.log(error);
                    return
                  }

                  //update values locally
                  var communityId = bendService.getActiveUser().community._id
                  this.state.pollQuestion.question.responseCounts = this.state.pollQuestion.question.responseCounts||{}
                  this.state.pollQuestion.question.responseCounts[communityId] = this.state.pollQuestion.question.responseCounts[communityId]||0
                  this.state.pollQuestion.question.responseCounts[communityId]++;
                  this.state.pollQuestion.answers[index].counts = this.state.pollQuestion.answers[index].counts||{}
                  this.state.pollQuestion.answers[index].counts[communityId] = this.state.pollQuestion.answers[index].counts[communityId]||0
                  this.state.pollQuestion.answers[index].counts[communityId] ++

                  this.state.pollQuestion.answers[index].percentages = this.state.pollQuestion.answers[index].percentages||{}
                  this.state.pollQuestion.answers[index].percentages[communityId] = Math.round(this.state.pollQuestion.answers[index].counts[communityId] * 100 / this.state.pollQuestion.question.responseCounts[communityId]);
                  
                  _.map(this.state.pollQuestion.answers, (obj)=>{
                    obj.percentages = obj.percentages||{}
                    obj.counts = obj.counts||{}
                    obj.percentages[communityId] = Math.round((obj.counts[communityId]||0) * 100 / this.state.pollQuestion.question.responseCounts[communityId]);
                  })

                  this.hasMounted&&this.setState({
                    pullQuestion:this.state.pollQuestion
                  })
                })

                timer.setTimeout( this, 'DailyPollTimer', () => {
                  timer.clearInterval(this, 'DailyPollTimer');
                  this.state.pollQuestion.myAnswer = this.state.pollQuestion.answers[index]
                  this.hasMounted&&this.setState({ selectedDailyPollStateMode: true });
                }, 500);
              }

              return (
                <RadioButton
                  labelHorizontal={ true }
                  key={ index }
                  style={ (this.state.pollQuestion.answers.length - 1) == index ? styles.radioButtonWrapper : [styles.radioButtonWrapper, styles.radioButtonBorder] }
                >
                  <RadioButtonInput
                    obj={{
                      label:obj.title,
                      value:obj.position
                    }}
                    index={ index }
                    isSelected={ this.state.selectedDailyPollIndex === index }
                    onPress={ onPressRadioButton }
                    borderWidth={ 1 }
                    buttonInnerColor={ commonColors.theme }
                    buttonOuterColor={ this.state.selectedDailyPollIndex === index ? commonColors.theme : commonColors.grayMoreText }
                    buttonSize={ 16 }
                    buttonOuterSize={ 16 }
                    buttonStyle={{ }}
                    buttonWrapStyle={ styles.radioButtonInputWrapper }
                  />
                  <RadioButtonLabel
                    obj={{
                      label:obj.title,
                      value:obj.position
                    }}
                    index={ index }
                    labelHorizontal={ true }
                    onPress={ onPressRadioButton }
                    labelStyle={ styles.textRadioButtonLabel }
                    labelWrapStyle={ styles.radioButtonLabelWrapper }
                  />
                </RadioButton>
              )
            }
          )}
        </RadioForm>
      </View>
    );
  }

  get showDailyPollStateMode() {
    return (
      <FadeInView>
        <View style={ styles.dailyPollSelectContentContainer }>
          {
            this.state.pollQuestion.answers.map( (obj, index) => {
              var communityId = bendService.getActiveUser().community._id;
              var percent = obj.percentages?Number(obj.percentages[communityId]||0):0
              return (
                <DailyPollStateCell
                  key={ index }
                  percent={ percent }
                  description={ obj.title }
                  selected={ this.state.selectedDailyPollIndex === index ? true : false }
                  bottomLine={ (this.state.pollQuestion.answers.length - 1) === index ? false : true }
                />
              );
            })
          }
        </View>
      </FadeInView>
    );
  }

  get showDailyPoll() {
    return (
      <View style={ styles.dailyPollContainer }>
        <Text style={ styles.textTitle }>Daily Poll</Text>
        <View style={ styles.dailyPollMainContentContainer }>
          <View style={ styles.dailyPollTopContentContainer }>
            <View style={ styles.dailyPollTopPointContainer }>
              <View style={ styles.dailyPollLearnMoreContainer }>
                <Text style={ styles.textQuestion }>{this.state.pollQuestion.question.question}</Text>
                <View style={ styles.buttonWrapper }>
                  <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onLearnMore() }>
                    <Text style={ styles.textReadMoreButton }>Learn More</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Point point={ 10 }/>
            </View>
          </View>

          {
            !this.state.pollQuestion.myAnswer ? this.showMainDailyPollSelectMode : this.showDailyPollStateMode
          }

        </View>
      </View>
    );
  }

  get showRecentActivity() {
    return (
      <View style={ styles.recentActivityContainer }>
        <Text style={ styles.textTitle }>Recent Activity at { this.state.community.name }</Text>
        <View style={ styles.recentActivityListViewWrapper }>
          <ListView
            enableEmptySections={ true }
            dataSource={ this.dataSourceRecentActivity.cloneWithRows(this.state.recentActivities) }
            renderRow={ this.renderRecentActivityRow.bind(this) }
          />
        </View>
        <LoadMoreSpinner
          show={ this.state.activityQuery.more }
          loading={ this.state.activityQuery.loading }
          onClick={ ()=> this.loadRecentActivities() }
        />
      </View>
    );
  }

  onGoSearchScreen() {
    this.props.onSearch();
  }

  onRefresh() {
    this.hasMounted&&this.setState({ isRefreshing: true });
    this.loadAllData();    
  }

  render() {
    return (
      <View style={ styles.container }>
        <NavSearchBar
          onGoSearchScreen={ () => this.onGoSearchScreen() }
          searchMode={ false }
        />
        <ScrollView
          style={ styles.scrollView }
          showsVerticalScrollIndicator={ false }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.isRefreshing }
              onRefresh={ () => this.onRefresh() }
              tintColor={ commonColors.theme }
            />
          }
        >
          { this.showChallenges }
          {this.showVideo}
          { this.showTrending }
          { this.showDailyPoll }
          { this.showRecentActivity }
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
    status: state.home.status, 
    commonStatus: state.common.status,
    likeResult: state.common.likeResult,
    recentActivityId: state.common.recentActivityId,
    recentActivityLike: state.common.recentActivityLike,
    activityId: state.common.activityId,
  }),
  (dispatch) => ({
    actions: bindActionCreators(homeActions, dispatch),
    recentActivityLikeActions: bindActionCreators(commonActions, dispatch),
  })
) (Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f4fafd',
  },
  slider: {

  },
  sliderContainer: {
    marginLeft: -carouselLeftMargin,
  },
  textTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    padding: 10,
  },
  recentActivityListViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
  },
  trendingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  trendingTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imageTrending: {
    width: 13,
    height: 8,
  },
  recentActivityContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  dailyPollContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  dailyPollMainContentContainer: {
    flex: 1,
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  dailyPollTopContentContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    paddingVertical: 10,
    paddingLeft: 25,
    paddingRight: 10,
  },
  dailyPollTopPointContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyPollLearnMoreContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textQuestion: {
    color: commonColors.question,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  buttonWrapper: {
    flex: 1,
    paddingTop: 8,
  },
  textReadMoreButton: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  textRadioButtonLabel: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  radioButtonLabelWrapper: {
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    paddingVertical: 10,
  },
  radioButtonInputWrapper: {
    paddingVertical: 10,
    marginLeft: 20,
  },
  radioButtonWrapper: {
    flex: 1,
  },
  radioButtonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  radioFormWrapper: {
    flex: 1,
  },
  dailyPollSelectContentContainer: {

  },
  dailyPollStateModeWrapper: {

  },
  imageVideo: {
    width: commonStyles.screenWidth,
    height: commonStyles.screenWidth * 0.453,
  },
  videoWrapper: {
    flexDirection:'row',
    alignItems:'center',
  },
});
