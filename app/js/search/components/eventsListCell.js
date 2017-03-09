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
import Point from '../../components/Point';

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
            <Text style={ styles.textTitle }>{ title }</Text>
          </View>
          <Point point={ coins }/>
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
    alignItems: 'center',
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
});
