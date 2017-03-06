import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';

import * as commonStyles from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const point = require('../../../assets/imgs/point.png');

const entryBorderRadius = 5;

export default class ChallengeCarousel extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    avatar: PropTypes.number,
    coins: PropTypes.number,
  };

  render () {
    const { title, subtitle, avatar, coins } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={ 0.5 }
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
          <View style={ styles.bottomContainer }>
            <View style={ styles.pointContainer }>
              <Image style={ styles.imagePoint } source={ point }>
                <Text style={ styles.textPoint }>+{ coins }</Text>            
              </Image>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
  pointContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingBottom: 10,

  },
  imagePoint: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPoint: {
    backgroundColor: 'transparent',
    color: commonColors.point,
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
});
