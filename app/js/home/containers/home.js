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
  Alert,
} from 'react-native';

import { bindActionCreators } from 'redux';
import * as homeActions from '../actions';
import { connect } from 'react-redux';

import Carousel from 'react-native-snap-carousel';
import NavSearchBar from '../../components/navSearchBar';

import ChallengeCarousel from '../components/challengeCarousel';
import TrendingCarousel from '../components/trendingCarousel';
import LeaderboardListCell from '../components/leaderboardListCell';
import RecentActivityListCell from '../components/recentActivityListCell';

import * as commonStyles from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

import { ChallengeCarouselEntries, LeaderboardEntries, TrendingCarouselEntries, RecentActivityEntries } from '../../components/dummyEntries';

const trending = require('../../../assets/imgs/trending.png');

const carouselLeftMargin = (commonStyles.carouselerWidth - commonStyles.carouselItemWidth) / 2 - commonStyles.carouselItemHorizontalPadding;



class Home extends Component {
  constructor(props) {
    super(props);

    var dataSourceLeaderboard = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    var dataSourceRecentActivity = new ListView.DataSource(
      { rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
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
        description={ rowData.description }
        avatar={ rowData.avatar }
        onClick={ () => this.onLeaderboardCellPressed(rowID) }
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

  onLeaderboardCellPressed (rowID) {

    alert("Tapped cell - " + rowID);
  }

  onRecentActivityCellPressed (rowID) {

    alert("Tapped cell - " + rowID);
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
        <Text style={ styles.title }>Leaderboard</Text>
        <View style={ styles.listViewWrap }>
          <ListView
            dataSource={ this.state.dataSourceLeaderboard }
            renderRow={ this.renderLeaderboardRow.bind(this) }
            contentContainerStyle={ styles.leaderboardListView}
          />
        </View>
      </View>
    );
  }

  get showTrending() {
    return (
      <View style={ styles.trendingContainer }>
        <View style={ styles.trendingTitleContainer }>
          <Text style={ styles.title }>Trending</Text>
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

  get showRecentActivity() {
    return (
      <View style={ styles.recentActivityContainer }>
        <Text style={ styles.title }>Recent Activity</Text>
        <View style={ styles.listViewWrap }>
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
          { this.showLeaderboard }
          { this.showTrending }
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
  title: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    padding: 10,
  },
  listViewWrap: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    height: commonStyles.hp(27),
  },
  trendingContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
});
