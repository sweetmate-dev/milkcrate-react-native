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

import Point from '../../components/Point';
import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const entryBorderRadius = 5;

export default class ChallengeCarousel extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    avatar: PropTypes.number,
    points: PropTypes.number,
  };

  render () {
    const { title, subtitle, avatar, points } = this.props;

    return (
      <TouchableHighlight
        activeOpacity={ 0.5 }
        underlayColor={ '#fff' }
        style={ styles.slideInnerContainer }
        onPress={() => { alert(`You've clicked '${ title }'`); }}
        >
        <View style={ styles.contentContainer }>
          <View style={ styles.topContainer }>
            <Text style={ styles.textTitle }>{ title }</Text>
          </View>
          <View style={ styles.centerContainer }>
            <Image style={ styles.avatar } source={ avatar } />
            <Text style={ styles.description }>{ subtitle } </Text>
          </View>
          {points > 0 && <View style={ styles.bottomContainer }>
            <Point point={ points }/>
          </View>}
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
    paddingHorizontal: 10,
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
  avatar: {
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
