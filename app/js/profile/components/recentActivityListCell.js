import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

import { screenWidth } from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';
import Point from '../../components/Point';

export default class RecentActivityListCell extends Component {

  static propTypes = {
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
        <View style={ styles.mainContainer }>
          <View style={ styles.leftContainer }>
            <View style={ styles.cellTopContainer }>
              <Image style={ styles.avatar } source={ icon } />
              <View style={ styles.cellTopTextContainer }>
                <View style={ styles.cellTopTitleCoinContainer }>
                  <View style={ styles.cellTopTitleContainer }>
                    <Text style={ styles.title }>{ title }</Text>
                  </View>
                </View>
                <Text style={ styles.text }>{ distance } Miles  $$</Text>
              </View>
            </View>
            <View style={ styles.cellBottomContainer }>
              <Text numberOfLines={ 1 } style={ styles.dscription }>{ description } </Text>
            </View>
          </View>
          <View style={ styles.rightCoinContainer }>
            <Point point={ coins }/>
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
    width: screenWidth,
  },
  leftContainer: {
    flex: 9,
  },
  cellTopContainer: {
    flexDirection: 'row',
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
    alignItems: 'center',
    paddingVertical: 5,
  },
  avatar: {
    width: 44,
    height: 44,
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
});
