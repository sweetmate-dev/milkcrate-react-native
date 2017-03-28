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
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as homeActions from '../actions';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import Carousel from 'react-native-snap-carousel';
import timer from 'react-native-timer';

import NavSearchBar from '../../components/navSearchBar';

import ChallengeCarousel from '../components/challengeCarousel';
import TrendingCarousel from '../components/trendingCarousel';
import RecentActivityListCell from '../components/recentActivityListCell';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DailyPollStateCell from '../components/dailyPollStateCell';
import Point from '../../components/Point';
import FadeInView from '../components/fadeInView';
import FadeOutView from '../components/fadeOutView';
import LoadMoreSpinner from '../../components/loadMoreSpinner';

//added by li, 2017/03/22
import bendService from '../../bend/bendService'
import * as _ from 'underscore'
import UtilService from '../../components/util'

import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

//import { ChallengeCarouselEntries, TrendingCarouselEntries, DailyPollEntries, RecentActivityEntries } from '../../components/dummyEntries';

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

      dataSourceRecentActivity: this.dataSourceRecentActivity.cloneWithRows([]),
      challenges: [],
      community: {},
      categories: [],
      trendings: [],
      recentActivities:[],
      pollQuestion:{
        question: {},
        answers: [],
        myAnswer: null,
      },
      activityQuery:{
        createdAt: 0,
        limit: 20,
        more: true,
        loading: false,
      }
    };

    this.loadRecentActivities.bind(this);
  }

  componentDidMount() {
    bendService.getCategories((error, cats)=>{
      this.setState({
        categories:cats
      })
    })

    bendService.getWeeklyChallenges( "", (error, result)=>{
      if (error) {
        console.log(error);
        return;
      }

      //console.log("getWeeklyChallenges", result);
      this.setState({ challenges: result });
    })

    bendService.getTrending( (error, result) => {

      if (error) {
        console.log(error);
        return;
      }

      console.log("current trending", error, result)
      this.setState({
        trendings:result
      })
    })

    bendService.getCommunity( (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      // console.log("community", error, result)
      this.setState({
        community:result
      })
    })

    this.loadRecentActivities()

    bendService.getPollQuestion( (error, question, answers, myAnswer) => {

      if (error) {
        console.log('poll questions erroror', error);
        return;
      }

      //console.log("poll questions", question, answers, myAnswer);

      this.setState({
        pollQuestion:{
          question:question,
          answers:answers,
          myAnswer:myAnswer
        }
      })
    })
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'home_request') {

    } else if (newProps.status == 'home_success') {

    } else if (newProps.status == 'home_erroror') {

    }
  }

  loadRecentActivities() {

    if ( this.state.activityQuery.more === false ) 
      return;
    
    this.setState( (state) => {  
      state.activityQuery.loading = true;
      return state;
    });
    console.log("call loadRecentActivities")
    bendService.getRecentActivities(this.state.activityQuery.createdAt, this.state.activityQuery.limit + 1, (error, result) => {
      console.log("getRecentActivities", error, result)
      this.setState( (state) => {  
        state.activityQuery.loading = false;
        return state;
      });

      if (error) {
        console.log(error);
        return;
      }

      this.state.activityQuery.more = (result.length == this.state.activityQuery.limit + 1)
      if(this.state.activityQuery.more) {
        //remove tail item
        result.pop()
      }

      if(result.length > 0) {
        this.state.recentActivities = this.state.recentActivities.concat(result)
        this.state.activityQuery.createdAt = result[result.length - 1]._bmd.createdAt
        this.setState({
          recentActivities:this.state.recentActivities
        })
      }

      console.log("this.state.recentActivities", this.state.recentActivities.length)

      this.setState({
        activityQuery:this.state.activityQuery
      })
    })
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {

    return (
      <RecentActivityListCell
        name={ rowData.user.name || '' }
        description={ rowData.summary || '' }
        avatar={ rowData.user.avatar ? UtilService.getSmallImage(rowData.user.avatar) : '' }
        defaultAvatar={UtilService.getDefaultAvatar(rowData.user.defaultAvatar)}
        time={ UtilService.getPastDateTime(rowData._bmd.createdAt) }
        hearts={ Number(rowData.likeCount||0) }
        likeByMe={ rowData.likedByMe||false }
        points={ Number(rowData.points||1) }
        onClick={ () => this.onRecentActivityCellPressed(rowData) }
        onLike={ () => this.onLike(rowData, !(rowData.likedByMe||false))
        }
      />
    );
  }

  onLike(activity, like) {
    bendService.likeActivity(activity, like, (err, ret)=>{
      if(err) {
        console.log(err);
        return
      }

      var exist = _.find(this.state.recentActivities, (o)=>{
        return o._id == activity._id
      })
      if(ret && exist) {
        exist.likedByMe = like
        if(like)
          exist.likeCount = Number(exist.likeCount||0) + 1
        else
          exist.likeCount = Math.max(Number(exist.likeCount||0) - 1, 0)

        this.setState({
          recentActivities:this.state.recentActivities
        })
      }
    })
  }

  onRecentActivityCellPressed (activity) {
    if(activity.type == 'business') {
      Actions.BusinessesDetail({ business: activity.activity });
    } else if(activity.type == 'action') {
      Actions.ActionDetail({ action: activity.activity });
    } else if(activity.type == 'event') {
      Actions.EventsDetail({ action: activity.activity });
    }
  }

  onLearnMore() {

    Actions.LearnMoreModal();
  }

  goChallenge(activity, type) {

  }

  getChallengeCarousel (entries) {

    return entries.map((entry, index) => {
      var cat = bendService.getActivityCategory(this.state.categories, entry.activity)
      return (
        <ChallengeCarousel
          key={ index }
          title={ entry.title }
          subtitle={entry.activity.name}
          icon={ UtilService.getCategoryIcon(cat) }
          points={ entry.activity.points ? Math.max(Number(entry.activity.points), 1) : 1 }
          link={ entry.activity.url }
          rawData={entry}
        />
      );
    });
  }

  getTrendingCarousel (entries) {
    if (!entries || entries.length == 0) {
      return false;
    }

    return entries.map((entry, index) => {
      var cat = bendService.getActivityCategory(this.state.categories, entry)
      return (
        <TrendingCarousel
          key={ `carousel-entry-${index}` }
          title='CHECK IN'
          activityType='business'
          location={ entry.name }
          icon={ cat ? UtilService.getCategorySticker(cat) : require('../../../assets/imgs/category-stickers/transit.png') }
          users={ entry.users }
          time={ entry._bmd.createdAt }
          hearts={ Number(entry.likeCount||0) }
          points={ Number(entry.points||1)}
          rawData={entry}
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

  get showTrending() {
    return (
      <View style={ styles.trendingContainer }>
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
            this.state.pollQuestion.answers.map((obj, index) => {
              var onPressRadioButton = (value, index) => {
                console.log(value, index)
                this.setState({
                  selectedDailyPollValue: value,
                  selectedDailyPollIndex: index
                });

                //do polling
                bendService.pollResponse(this.state.pollQuestion.question, this.state.pollQuestion.answers[index], (error, result)=>{
                  if(error) {
                    console.log(error);
                    return
                  }

                  //update values locally
                  this.state.pollQuestion.question.responseCount ++;
                  this.state.pollQuestion.answers[index].count ++
                  this.state.pollQuestion.answers[index].percentage = Math.round(this.state.pollQuestion.answers[index].count * 100 / this.state.pollQuestion.question.responseCount);
                  _.map(this.state.pollQuestion.answers, (o)=>{
                    o.percentage = Math.round(o.count * 100 / this.state.pollQuestion.question.responseCount);
                  })

                  this.setState({
                    pullQuestion:this.state.pollQuestion
                  })
                })

                timer.setTimeout( this, 'DailyPollTimer', () => {
                  timer.clearInterval(this, 'DailyPollTimer');
                  this.state.pollQuestion.myAnswer = this.state.pollQuestion.answers[index]
                  this.setState({ selectedDailyPollStateMode: true });
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
            this.state.pollQuestion.answers.map((obj, index) => {
              return (
                <DailyPollStateCell
                  key={ index }
                  percent={ Number(obj.percentage) }
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
        <Text style={ styles.textTitle }>Recent Activity at { this.state.community.location }</Text>
        <View style={ styles.recentActivityListViewWrapper }>
          <ListView
              enableEmptySections={ true }
              dataSource={ this.dataSourceRecentActivity.cloneWithRows(this.state.recentActivities) }
              renderRow={ this.renderRecentActivityRow.bind(this) }/>
        </View>
        <LoadMoreSpinner
          show={ this.state.activityQuery.more }
          loading={ this.state.activityQuery.loading }
          onClick={ ()=> this.loadRecentActivities() }
        />
      </View>
    );
  }

  render() {
    const { status } = this.props;

    return (
      <View style={ styles.container }>
        <NavSearchBar/>
        <ScrollView
          style={ styles.scrollView }
          indicatorStyle={ 'white' }
          scrollEventThrottle={ 200 }
        >
          { this.showChallenges }
          { this.showTrending }
          { this.showDailyPoll }
          { this.showRecentActivity }
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  status: state.search.status
  }),
  (dispatch) => ({
    actions: bindActionCreators(homeActions, dispatch)
  })
)(Home);

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
    paddingRight: 15,
  },
  dailyPollTopPointContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyPollLearnMoreContainer: {
    alignSelf: 'stretch',
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
    // flex: 1,
    paddingVertical: 10,
    marginLeft: 20,
  },
  radioButtonWrapper: {
    flex: 1,
    // marginLeft: 40,
  },
  radioButtonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  radioFormWrapper: {
    flex: 1,
    // paddingLeft: 15,
  },
  dailyPollSelectContentContainer: {
    // paddingLeft: 15,
  },
  dailyPollStateModeWrapper: {

  },

});
