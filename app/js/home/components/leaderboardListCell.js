import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

import { screenWidth } from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const chevron_down = require('../../../assets/imgs/chevron_down.png');
const chevron_up = require('../../../assets/imgs/chevron_up.png');

export default class LeaderboardListCell extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    status: PropTypes.number,
    index: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    avatar: PropTypes.number.isRequired,
    // onClick: PropTypes.func,
  }

  static defaultProps = {
    width: screenWidth,
    height: 32,
    status: 0,
    // onClick: () => {}
  }

  constructor(props) {

    super(props);
    // this.onClick = this.onClick.bind(this);
  }

  // onClick() {

  //   if (this.props.onClick) {
  //     this.props.onClick();
  //   }
  // }

  showStatus (status) {

    if (status == 1)
      return (
        <Image style={ styles.imageStatus } source={ chevron_up }/>
      );
    else if (status == 2)
      return (
        <Image style={ styles.imageStatus } source={ chevron_down }/>
      );
    return (
      <View style={ styles.imageStatus } />
    );
  }

  showDescription(status, name, description) {

    if (status == 1) {
      return (
        <View style={ styles.secondWrap }>
          <Text style={ styles.textName }>{ name }</Text>
          <Text style={ styles.textDescription }>{ description }</Text>
        </View>
      );
    } else if ((status == 2) || (status == 3)) {
      return (
        <View style={ styles.secondWrap }>
          <Text style={ [styles.textName, { opacity: 0.6 }] }>{ name }</Text>
          <Text style={ [styles.textDescription, { opacity: 0.6 }] }>{ description }</Text>
        </View>
      );
    }
  }

  showAvatar( status, avatar) {
    if (status == 1)
      return (<Image style={ styles.avatar } source={ avatar }/>);
    
    return (<Image style={ [styles.avatar, {opacity: 0.6}] } source={ avatar }/>);
  }

  render() {
    const {
      height,
      width,
      status,
      index,
      name,
      description,
      avatar,
      // onClick,
    } = this.props;

    return (
      // <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.firstWrap }>
            { this.showStatus(status) }
            <Text style={ styles.textIndex }>{ index }</Text>
            { this.showAvatar(status, avatar) }
            { this.showDescription(status, name, description) }
          </View>
        </View>
      // </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  cellContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  firstWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStatus: {
    width: 8,
    height: 4,
  },
  textIndex: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    paddingHorizontal: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 2,
  },
  secondWrap: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  textName: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textDescription: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
});
