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
const avatar1 = require('../../../assets/imgs/avatar.png');

export default class EventsListCell extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    avatar: PropTypes.number.isRequired,
    coins: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    coins: 0,
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
      title,
      avatar,
      coins,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.mainContainer }>
            <Image style={ styles.avatar } source={ avatar }/>
            <Text style={ styles.textTitle }> { title }</Text>
          </View>
          <View style={ styles.coinContainer }>
            <Text style={ styles.coinNumber }>{ coins } </Text>
            <Image style={ styles.imageIcon } source={ coinImage } />
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
    height: commonStyles.hp(8),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderStyle: 'solid',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  textTitle: {
    flex: 1,
    paddingLeft: 10,
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  imageIcon: {
    width: 16,
    height: 16,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  coinNumber: {
    color: commonColors.coinNumber,
    fontFamily: 'Open Sans',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 5,
  },
});
