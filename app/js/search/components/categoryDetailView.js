import React, { PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';

const { width } = Dimensions.get('window');
const star = require('../../../assets/imgs/star.png');

export default class CategoryDetailView extends React.Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    title: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    distance: PropTypes.number,
    price: PropTypes.number,
    rating: PropTypes.number,
    onClick: PropTypes.func,
    mode: PropTypes.number
  }

  static defaultProps = {
    mode: 0,
    rating: 5.0,
    width: width,
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
      rating,
      onClick,
      mode,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }
                          underlayColor='#dddddd'>
        <View style={ [{ height: height }, { width: width },
            mode == 0 ? styles.cellContainer : styles.detailContainer
          ]}>
          <View style={ styles.cellTopContainer }>
            <Image style={ styles.avatar } source={ icon } />
            <View style={ styles.cellTopTextContainer }>
              <View style={ styles.cellTopTitleRatingContainer }>
                <View style={ styles.cellTopTitleContainer }>
                  <Text style={ styles.title }> { title }</Text>
                </View>
                <View style={ styles.cellTopRatingContainer }>
                  <Text style={ styles.text }> { rating } </Text>
                  <Image style={ styles.star } source={ star } />
                </View>
              </View>
              <Text style={ styles.text }>{ distance } Miles  { price} $$</Text>
            </View>
          </View>
          <View style={ styles.cellBottomContainer }>
            <Text style={ styles.dscription }>{ description} </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  cellContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#d4ebf6',
  },
  detailContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d4ebf6',
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
    width: 12,
    height: 11,
    marginLeft: 3,
  },
  title: {
    color: '#5e8aa3',
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  dscription: {
    color: '#808080',
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  text: {
    color: '#a4a4a3',
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
});
