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

import { Actions } from 'react-native-router-flux';

import Point from '../../components/Point';
import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const entryBorderRadius = 5;

export default class ChallengeCarousel extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    icon: PropTypes.number,
    points: PropTypes.number,
  };

  goChallengeActivityDetail() {
    var challenge = this.props.rawData;
    if(challenge.type == 'business') {
      Actions.BusinessesDetail({ business: challenge.activity });
    } else if(challenge.type == 'action') {
      Actions.ActionDetail({ action: challenge.activity });
    } else if(challenge.type == 'event') {
      Actions.EventDetail({ event: challenge.activity });
    } else if(challenge.type == 'serivce') {
      Actions.ServiceDetail({ serivce: challenge.activity });
    }
  }

  render () {
    const { 
      title, 
      subtitle, 
      icon, 
      points 
    } = this.props;

    return (
      <TouchableHighlight
        activeOpacity={ 0.5 }
        underlayColor={ '#fff' }
        style={ styles.slideInnerContainer }
        onPress={ () => { this.goChallengeActivityDetail() }}
      >
        <View style={ styles.contentContainer }>
          <View style={ styles.topContainer }>
            <Text style={ styles.textTitle }>{ title }</Text>
          </View>
          <View style={ styles.centerContainer }>
            <Image style={ styles.icon } source={ icon } />
            <Text style={ styles.description }>{ subtitle } </Text>
          </View>
          <View style={ styles.bottomContainer }>
            { points > 0 && <Point point={ points }/> }
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
    height: commonStyles.carouselHeight,
    paddingHorizontal: commonStyles.carouselItemHorizontalPadding,
    marginVertical: 10,    
  },
  contentContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: commonColors.line,
    borderStyle: 'solid',
    borderRadius: entryBorderRadius,
    backgroundColor: '#fff',
  },
  topContainer: {
    flex: 1,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bottomContainer: {
    flex: 1,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  textTitle: {
    color: commonColors.title,
    fontFamily: 'Blanch',
    fontSize: 28,
    textAlign: 'center',
  },
  icon: {
    width: 44,
    height: 44,
  },
  description: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingHorizontal: 5,
  },
});
