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

import Carousel from 'react-native-snap-carousel';
import NavSearchBar from '../../components/navSearchBar';

import ChallengeCarousel from '../components/challengeCarousel';
import TrendingCarousel from '../components/trendingCarousel';
import LeaderboardListCell from '../../components/leaderboardListCell';
import RecentActivityListCell from '../components/recentActivityListCell';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import DailyPollStateCell from '../components/dailyPollStateCell';
import Point from '../../components/Point';


import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

import { ChallengeCarouselEntries, LeaderboardEntries, TrendingCarouselEntries, DailyPollEntries, RecentActivityEntries } from '../../components/dummyEntries';

const trending = require('../../../assets/imgs/trending.png');

const carouselLeftMargin = (commonStyles.carouselerWidth - commonStyles.carouselItemWidth) / 2 - commonStyles.carouselItemHorizontalPadding;
const dummyText1 = 'See how your lifestyle choices to See how your lifestyle choices to See how your lifestyle choices to See how your lifestyle choices to See how your lifestyle choices to See how your lifestyle choices to';

class Home extends Component {
  constructor(props) {
    super(props);

    var dataSourceLeaderboard = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    var dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      selectedDailyPollValue: '',
      selectedDailyPollIndex: -1,
      dailyPollReadLines: 1,
      selectedDailyPollValue: 0,
      selectedDailyPollIndex: -1,

      dataSourceLeaderboard: dataSourceLeaderboard.cloneWithRows(LeaderboardEntries),
      dataSourceRecentActivity: dataSourceRecentActivity.cloneWithRows(RecentActivityEntries),
    };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'home_request') {

    } else if (newProps.status == 'home_success') {

    } else if (newProps.status == 'home_error') {

    }
  }

  renderLeaderboardRow(rowData, sectionID, rowID) {

    return (
      <LeaderboardListCell
        status={ rowData.status }
        index={ Number(rowID) + 1 }
        name={ rowData.name }
        points={ rowData.points }
        avatar={ rowData.avatar }
      />
    );
  }

  renderRecentActivityRow(rowData, sectionID, rowID) {

    return (
      <RecentActivityListCell
        name={ rowData.name }
        description={ rowData.description }
        avatar={ rowData.avatar }
        time={ rowData.time }
        hearts={ rowData.hearts }
        coins={ rowData.coins }
        onClick={ () => this.onRecentActivityCellPressed(rowID) }
      />
    );
  }

  onLeaderboardCellPressed () {
    alert("Tapped Leaderboard");
  }

  onRecentActivityCellPressed (rowID) {
    alert("Tapped cell - " + rowID);
  }

  onReadMoreLess() {

    if (this.state.dailyPollReadLines == 0)
      this.setState({ dailyPollReadLines: 1 });
    else 
      this.setState({ dailyPollReadLines: 0 });
  }

  getChallengeCarousel (entries) {
    if (!entries) {
      return false;
    }

    return entries.map((entry, index) => {
      return (
        <ChallengeCarousel
          key={`carousel-entry-${index}`}
          {...entry}
        />
      );
    });
  }

  getTrendingCarousel (entries) {
    if (!entries) {
      return false;
    }

    return entries.map((entry, index) => {
      return (
        <TrendingCarousel
          key={`carousel-entry-${index}`}
          {...entry}
        />
      );
    });
  }

  get showChallenges () {
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
        { this.getChallengeCarousel(ChallengeCarouselEntries) }
      </Carousel>
    );
  }

  get showLeaderboard() {
    return (
      <View style={ styles.leaderboardContainer }>
        <Text style={ styles.textTitle }>Comcast Leaderboard • You are in 4th place</Text>
        <TouchableHighlight onPress={ () => this.onLeaderboardCellPressed() }>
          <View style={ styles.leaderboardListViewWrapper }>
            <ListView
              dataSource={ this.state.dataSourceLeaderboard }
              renderRow={ this.renderLeaderboardRow.bind(this) }
              contentContainerStyle={ styles.leaderboardListView}
            />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  get showTrending() {
    return (
      <View style={ styles.trendingContainer }>
        <View style={ styles.trendingTitleContainer }>
          <Text style={ styles.textTitle }>Currently Trending</Text>
          <Image style={ styles.imageTrending } source={ trending }/>
        </View>
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
          { this.getTrendingCarousel(TrendingCarouselEntries) }
        </Carousel>
      </View>
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
            DailyPollEntries.map((obj, index) => {
              var onPress = (value, index) => {
                this.setState({
                  selectedDailyPollValue: value,
                  selectedDailyPollIndex: index
                })
                {/*alert( 'Selected Index - ' + index.toString() );*/}
              }
              
              return (
                <RadioButton 
                  labelHorizontal={ true }
                  key={ index }
                  style={ (DailyPollEntries.length - 1) == index ? styles.radioButtonWrapper : [styles.radioButtonWrapper, styles.radioButtonBorder] }
                >
                  <RadioButtonInput
                    obj={ obj }
                    index={ index }
                    isSelected={ this.state.selectedDailyPollIndex === index }
                    onPress={ onPress }
                    borderWidth={ 1 }
                    buttonInnerColor={ commonColors.theme }
                    buttonOuterColor={ this.state.selectedDailyPollIndex === index ? commonColors.theme : commonColors.grayMoreText }
                    buttonSize={ 16 }
                    buttonOuterSize={ 16 }
                    buttonStyle={{ }}
                    buttonWrapStyle={ styles.radioButtonInputWrapper }
                  />
                  <RadioButtonLabel
                    obj={ obj }
                    index={ index }
                    labelHorizontal={ true }
                    onPress={ onPress }
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
      <View style={ styles.dailyPollSelectContentContainer }>
        {
          DailyPollEntries.map((obj, index) => {
            return (
              <DailyPollStateCell
                key={ index }
                percent={ obj.percent }
                description={ obj.label }
                selected={ this.state.selectedDailyPollIndex === index ? true : false }
                bottomLine={ (DailyPollEntries.length - 1) === index ? false : true }
              />
            );
          })
        }
      </View>
    );
  }

  get showDailyPoll() {
    return (
      <View style={ styles.dailyPollContainer }>
        <Text style={ styles.textTitle }>Daily Poll</Text>
        <View style={ styles.dailyPollMainContentContainer }>
          <View style={ styles.dailyPollTopContentContainer }>
            <View style={ styles.dailyPollTopTitlePointContainer }>
              <Text style={ styles.textQuestion }>What is your typical weekly diet?</Text>
              <Point point={ 10 }/>
            </View>
            <View style={ styles.descriptionContainer }>
              <Text style={ styles.textDescription } numberOfLines={ this.state.dailyPollReadLines }>{ dummyText1 }</Text>
              <View style={ styles.buttonWrapper }>
                <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onReadMoreLess() }>
                  <Text style={ styles.textReadMoreButton }>{ this.state.dailyPollReadLines == 1 ? 'Read More' : 'Read Less' }</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {
            this.state.selectedDailyPollIndex === -1 ? this.showDailyPollSelectMode : this.showDailyPollStateMode
          }

        </View>
      </View>
    );
  }

  get showRecentActivity() {
    return (
      <View style={ styles.recentActivityContainer }>
        <Text style={ styles.textTitle }>Recent Activity at Comcast</Text>
        <View style={ styles.recentActivityListViewWrapper }>
          <ListView
            dataSource={ this.state.dataSourceRecentActivity }
            renderRow={ this.renderRecentActivityRow.bind(this) }/>
        </View>
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
          {/*{ this.showLeaderboard }*/}
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
  leaderboardContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textTitle: {
    color: commonColors.grayMoreText,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    padding: 10,
  },
  leaderboardListViewWrapper: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    height: commonStyles.hp(27),
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
  leaderboardListView: {
    flex: 1,
    justifyContent: 'center',
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
  dailyPollTopTitlePointContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textQuestion: {
    color: commonColors.question,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  textDescription: {
    flex: 3,
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
  },
  textReadMoreButton: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'right',
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
    marginLeft: 5,
    paddingVertical: 10,
  },
  radioButtonInputWrapper: {
    paddingVertical: 10,
    marginLeft: -30,
  },
  radioButtonWrapper: {
    marginLeft: 40,
  },
  radioButtonBorder: {
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,    
  },
  radioFormWrapper: {
    flex: 1,
    paddingLeft: 15,
  },
  dailyPollSelectContentContainer: {
    // paddingLeft: 15,
  },
  dailyPollStateModeWrapper: {

  },

});
