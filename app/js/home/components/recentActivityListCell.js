import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

import * as commonStyles from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const coinImage = require('../../../assets/imgs/conis.png');
const heart = require('../../../assets/imgs/heart.png');

export default class RecentActivityListCell extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    avatar: PropTypes.number.isRequired,
    time: PropTypes.number,
    heart: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(14),
    heart: 0,
    onClick: () => {}
  }

  constructor(props) {

    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {

    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const {
      height,
      width,
      name,
      description,
      avatar,
      time,
      hearts,
      coins,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.avatarsContainer }>
            <Image style={ styles.avatar } source={ avatar }/>
          </View>
          <View style={ styles.mainContentContainer }>
            <View style={ styles.names_timeContainer }>
              <Text style={ styles.textName }>{ name }</Text>
              <Text style={ styles.textSmall }>{ time } min ago completed</Text>
            </View>
            <Text style={ styles.textDescription }>{ description }</Text>
            <View style={ styles.like_coinContainer }>
              <View style={ styles.heartContainer }>
                <Image style={ styles.imageIcon } source={ heart }/>
                <Text style={ styles.textSmall }>
                {
                  hearts != 0 ? hearts : hearts + " - Be the first to like it!"
                }
                </Text>
              </View>
              <View style={ styles.coinContainer }>
                <Text style={ styles.coinNumber }>{ coins } </Text>
                <Image style={ styles.imageIcon } source={ coinImage } />
              </View>
            </View>

          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: commonStyles.hp(14),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderStyle: 'solid',
  },
  avatarContainer: {
    paddingVertical: 5,
  },
  mainContentContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  names_timeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 2,
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
  textDescription: {
    flex: 1,
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  like_coinContainer: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    width: 16,
    height: 16,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinNumber: {
    color: commonColors.coinNumber,
    fontFamily: 'Open Sans',
    fontSize: 12,
    textAlign: 'center',
  },
});
