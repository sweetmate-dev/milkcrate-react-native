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

const coinImage = require('../../../assets/imgs/conis.png');

const entryBorderRadius = 5;

export default class ChallengeCarousel extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    avatar: PropTypes.number,
    coins: PropTypes.number,
  };

  onRemindMeLater () {

    alert("clicked onRemindMeLater");
  }

  onLearnMore () {

    alert("clicked onLearnMore");
  }

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
            <Text style={ styles.title }>{ title }</Text>
          </View>
          <View style={ styles.centerContainer }>
            <Image style={ styles.avatar } source={ avatar } />
            <Text style={ styles.description }>{ subtitle } </Text>
            <View style={ styles.coinContainer }>
              <Text style={ styles.coinNumber }>{ coins } </Text>
              <Image style={ styles.coinImage } source={ coinImage } />
            </View>
          </View>
          <View style={ styles.bottomContainer }>
            <View style={ styles.container }>
              <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onRemindMeLater() }>
                <View style={ styles.remindButtonWrap }>
                  <Text style={ styles.remindText }>Remind me later</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={ styles.container }>
              <TouchableOpacity activeOpacity={ .5 } onPress={ () => this.onLearnMore() }>
                <View style={ styles.learnMoreButtonWrap }>
                  <Text style={ styles.learnMoreText }>Learn More</Text>
                </View>
              </TouchableOpacity>
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
    flexDirection: 'row',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
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
    flex: 5,
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
    paddingHorizontal: 5,
  },
  coinContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinNumber: {
    color: '#eaD475',
    fontFamily: 'Open Sans',
    fontSize: 12,
    textAlign: 'center',
  },
  coinImage: {
    width: 16,
    height: 16,
  },
  remindButtonWrap: {
    padding: 5,
    borderRadius: 5,
    margin: 10,
  },
  remindText: {
    color: commonColors.theme,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  learnMoreButtonWrap: {
    backgroundColor: '#125e65',
    borderRadius: 5,
    padding: 5,
    margin: 10,
  },
  learnMoreText: {
    color: '#fff',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});
