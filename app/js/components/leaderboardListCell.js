import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

import { screenWidth } from '../styles/commonStyles';
import * as commonColors from '../styles/commonColors';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const chevron_down = require('../../assets/imgs/chevron_down.png');
const chevron_up = require('../../assets/imgs/chevron_up.png');

export default class LeaderboardListCell extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    status: PropTypes.number,
    index: PropTypes.number,
    name: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    avatar: PropTypes.number.isRequired,
    // onClick: PropTypes.func,
  }

  static defaultProps = {
    width: screenWidth,
    height: 32,
    status: 0,
    points: 0,
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

  showInfo(status, name, points) {

    if (status == 1) {
      return (
        <View style={ styles.activeCellInfoContainer }>
          <View style={ styles.secondContainer }>
            <Text style={ styles.textName }>{ name }</Text>
            <Text style={ styles.textPoints }>{ points } points</Text>
          </View>
          <View style={ styles.viewMoreContainer }>
            <Text style={ styles.textViewMore }>View More</Text>
            <EntypoIcon style={ styles.rightIcon } name="chevron-thin-right" size={ 15 } color={ commonColors.grayMoreText }/>
          </View>
        </View>  
      );
    } else if ((status == 2) || (status == 3)) {
      return (
        <View style={ styles.secondContainer }>
          <Text style={ [styles.textName, { opacity: 0.6 }] }>{ name }</Text>
          <Text style={ [styles.textPoints, { opacity: 0.6 }] }>{ points } points</Text>
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
      points,
      avatar,
      // onClick,
    } = this.props;

    return (
      // <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.firstContainer }>
            { this.showStatus(status) }
            <Text style={ styles.textIndex }>{ index }</Text>
            { this.showAvatar(status, avatar) }
            { this.showInfo(status, name, points) }
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
  firstContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  secondContainer: {
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
  textPoints: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  activeCellInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewMoreContainer: {
    flexDirection: 'row',
  },
  textViewMore: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  rightIcon: {
    paddingTop: 2.5,
    alignSelf: 'center',
  },
});
