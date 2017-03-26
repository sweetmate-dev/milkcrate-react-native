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
    icon: PropTypes.number,
    points: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    points: 0,
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
      icon,
      points,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.mainContainer }>
            <Image style={ styles.icon } source={ icon }/>
            <Text numberOfLines={2} style={ styles.textTitle }>{ title }</Text>
          </View>
          <Point point={ points }/>
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
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  icon: {
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
