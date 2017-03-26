import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableHighlight,
} from 'react-native';

import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';
import Point from '../../components/Point';

import UtilService from '../../components/util'

const locationImage = require('../../../assets/imgs/location.png');
const heart = require('../../../assets/imgs/heart.png');
import { Actions } from 'react-native-router-flux';

export const carouselHeight = commonStyles.screenHiehgt * 0.36;
const entryBorderRadius = 5;

export default class TrendingCarousel extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    location: PropTypes.string,
    icon: PropTypes.number,
    users: PropTypes.array,
    time: PropTypes.number,
    hearts: PropTypes.number,
    points: PropTypes.number,
  };

  getUsers(entries) {

    if (entries.length == 0) {
      return false;
    }

    return entries.map((entry, index) => {

      if (index > 6) {

        return null;
      }

      if(entry.avatar)
        return (
          <Image key={ index} style={ styles.imageUserAvatar } source={{uri:entry.avatar._downloadURL}}/>
        );
      else
        return (
            <Image key={ index} style={ styles.imageUserAvatar } source={require('../../../assets/imgs/default-avatar.png')}/>
        );
    });
  }

  goActivityDetail() {
    if(this.props.activityType == 'business') {
      Actions.BusinessesDetail({ business: this.props.rawData });
    } else if(this.props.activityType == 'action') {
      Actions.ActionDetail({ action: this.props.rawData });
    } else if(this.props.activityType == 'event') {
      Actions.EventsDetail({ action: this.props.rawData });
    }
  }

  render () {
    const { title, location, icon, users, time, hearts, points } = this.props;

    return (
      <TouchableHighlight
        activeOpacity={ 0.5 }
        underlayColor={ '#fff' }
        style={ styles.slideInnerContainer }
        onPress={() => { this.goActivityDetail() }}
      >
        <View style={ styles.contentContainer }>
          <View style={ styles.backgroundContainer }>
            <View style={ styles.topBackground }/>
            <View style={ styles.bottomBackground }>
            </View>
          </View>
          <View style={ styles.topContainer }>
            <Text style={ styles.textCategory }> { title } </Text>
            <View style={ styles.locationContainer }>
              <Image style={ styles.imageLocation } source={ locationImage }/>
              <Text style={ styles.textLocation }>{ location }</Text>
            </View>
          </View>
          <View style={ styles.centerContainer }>
            <Image style={ styles.imageCategoryIcon } source={ icon }/>
          </View>
          <View style={ styles.bottomContainer }>
            <View style={ styles.avatarsMainContainer }>
              <View style={ styles.names_timeContainer }>
                <Text style={ styles.textName }>{ users[0].name } and {users.length - 1} others</Text>
                <Text style={ styles.textSmall }>Latest {UtilService.getPastDateTime(time)}</Text>
              </View>
              <View style={ styles.avatarsContainer }>
                { this.getUsers(users) }
                {users.length > 6 && <View style={ styles.moreUserContainer }>
                  <Text style={ styles.textMoreUser }>+{ users.length - 6 }</Text>
                </View>}
              </View>
            </View>
            <View style={ styles.like_coinContainer }>
              <View style={ styles.heartContainer }>
                <Image style={ styles.imageLike } source={ heart }/>
                <Text style={ styles.textSmall }> { hearts }</Text>
              </View>
              <Point point={ points }/>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slideInnerContainer: {
    width: commonStyles.carouselItemWidth,
    height: carouselHeight,
    paddingHorizontal: commonStyles.carouselItemHorizontalPadding,
  },
  contentContainer: {
    flex: 1,
    borderRadius: entryBorderRadius,
    backgroundColor: '#fff',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  topBackground: {
    flex: 5,
    width: commonStyles.carouselWidth,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    backgroundColor: commonColors.theme,
  },
  bottomBackground: {
    flex: 7,
    backgroundColor: '#fff',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    borderWidth: 1,
    borderColor: commonColors.line,
    borderStyle: 'solid',
  },
  imageCategoryIcon: {
    width: 40,
    height: 40,
  },
  topContainer: {
    flex: 4,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  bottomContainer: {
    flex: 6,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 10,
  },
  textCategory: {
    color: '#fff',
    fontFamily: 'Blanch',
    fontSize: 32,
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLocation: {
    width: 10,
    height: 16,
  },
  textLocation: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
    paddingLeft: 5,
  },
  avatarsMainContainer: {
    flex : 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  names_timeContainer: {
    flexDirection: 'row',
  },
  avatarsContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  like_coinContainer: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  textName: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  textSmall: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
    paddingLeft: 5,
  },
  imageUserAvatar: {
    width: 32,
    height: 32,
  },
  moreUserContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#efefef',
  },
  textMoreUser: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLike: {
    width: 16,
    height: 15,
  },
});
