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

const point = require('../../../assets/imgs/point.png');

export default class RecentActivityListCell extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    title: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    distance: PropTypes.number,
    price: PropTypes.number,
    coins: PropTypes.number,
    onClick: PropTypes.func,
    mode: PropTypes.number
  }

  static defaultProps = {
    mode: 0,
    coins: 0,
    width: screenWidth,
    height: 83,
    distance: 1,
    price: 0,
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
      title,
      icon,
      description,
      distance,
      price,
      coins,
      onClick,
      mode,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() } underlayColor='#dddddd'>
        <View style={ [{ height: height }, { width: width }, styles.mainContainer] }>
          <View style={ styles.leftContainer }>
            <View style={ styles.cellTopContainer }>
              <Image style={ styles.avatar } source={ icon } />
              <View style={ styles.cellTopTextContainer }>
                <View style={ styles.cellTopTitleCoinContainer }>
                  <View style={ styles.cellTopTitleContainer }>
                    <Text style={ styles.title }>{ title }</Text>
                  </View>
                </View>
                <Text style={ styles.text }>{ distance } Miles  { price } $$</Text>
              </View>
            </View>
            <View style={ styles.cellBottomContainer }>
              <Text style={ styles.dscription }>{ description } </Text>
            </View>
          </View>
          <View style={ styles.rightCoinContainer }>
            <Image style={ styles.imagePoint } source={ point }>
              <Text style={ styles.textPoint }>+{ coins }</Text>            
            </Image>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  leftContainer: {
    flex: 9,
  },
  cellTopContainer: {
    flexDirection: 'row',
    flex: 3,
    alignItems: 'center',
  },
  cellTopTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
    paddingVertical: 5,
  },
  cellTopTitleCoinContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTopTitleContainer: {
    flex: 5,
    alignItems: 'flex-start',
  },
  rightCoinContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellBottomContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
  },
  imagePoint: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: commonColors.title,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  dscription: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  text: {
    backgroundColor: 'transparent',
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
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
