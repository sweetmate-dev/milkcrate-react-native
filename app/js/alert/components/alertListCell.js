import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

import * as commonStyles from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';

const coinImage = require('../../../assets/imgs/conis.png');
const heart = require('../../../assets/imgs/heart.png');

export default class AlertListCell extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    avatar: PropTypes.number.isRequired,
    time: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(10),
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

  showTime( time ) {
    return (
      time > 1 ?
        <Text style={ styles.textSmall }>{ time } days ago</Text>
        :
        <Text style={ styles.textSmall }>{ time } day ago</Text>
    );
  }

  render() {
    const {
      height,
      width,
      name,
      description,
      avatar,
      time,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.avatarContainer }>
            <Image style={ styles.avatar } source={ avatar }/>
          </View>
          <View style={ styles.mainContentContainer }>
            <View style={ styles.names_timeContainer }>
              <Text style={ styles.textName }>{ name }</Text>
              { this.showTime (time) }
            </View>
            <Text style={ styles.textDescription }>{ description }</Text>
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
    height: commonStyles.hp(10),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderStyle: 'solid',
  },
  avatarContainer: {
    justifyContent: 'center',
  },
  mainContentContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  names_timeContainer: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },  
});
