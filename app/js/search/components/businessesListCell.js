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

const star = require('../../../assets/imgs/star.png');

export default class BusinessesListCell extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    description: PropTypes.string,
    distance: PropTypes.number,
    price: PropTypes.number,
    rating: PropTypes.number,
    onClick: PropTypes.func,
    mode: PropTypes.number
  }

  static defaultProps = {
    mode: 0,
    rating: 5.0,
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
      title,
      icon,
      description,
      distance,
      price,
      rating,
      onClick,
      mode,
    } = this.props;

    let dollars = '$';
    for (i = 1 ; i < price ; i++)
      dollars += '$';
    
    return (
      <TouchableHighlight 
        onPress={ () => onClick() } 
        underlayColor='#dddddd'
      >
        <View style={ mode == 0 ? styles.cellContainer : styles.detailContainer }>
          <View style={ styles.cellTopContainer }>
            <Image style={ styles.avatar } source={ icon } />
            <View style={ styles.cellTopTextContainer }>
              <View style={ styles.cellTopTitleRatingContainer }>
                <View style={ styles.cellTopTitleContainer }>
                  <Text style={ styles.title }>{ title }</Text>
                </View>
                <View style={ styles.cellTopRatingContainer }>
                  <Text style={ styles.text }>{ rating } </Text>
                  <Image style={ styles.star } source={ star } />
                </View>
              </View>
              <Text style={ styles.text }>{ distance.toFixed(3) } Miles  { dollars }</Text>
            </View>
          </View>
          <View style={ styles.cellBottomContainer }>
            <Text numberOfLines={ 1 } style={ styles.dscription }>{ description } </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  cellContainer: {
    width: screenWidth,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
  },
  detailContainer: {
    width: screenWidth,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: commonColors.line,
    borderRadius: 5,
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
  cellTopTitleRatingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellTopTitleContainer: {
    flex: 5,
    alignItems: 'flex-start',
  },
  cellTopRatingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  star: {
    width: 16,
    height: 16,
    marginLeft: 3,
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
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
});
