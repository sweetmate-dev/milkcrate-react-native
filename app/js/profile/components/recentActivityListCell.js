import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import { screenWidth } from '../../styles/commonStyles';
import * as commonColors from '../../styles/commonColors';
import Point from '../../components/Point';

const imageHeart = require('../../../assets/imgs/heart.png');
const imageRedHeart = require('../../../assets/imgs/heart_red.png');

export default class RecentActivityListCell extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    distance: PropTypes.number,
    price: PropTypes.number,
    coins: PropTypes.number,
    onClick: PropTypes.func,
    mode: PropTypes.number,
    likeByMe: PropTypes.bool,
    hearts: PropTypes.number,
  }

  static defaultProps = {
    mode: 0,
    coins: 0,
    distance: 1,
    price: 0,
    likeByMe: false,
    hearts: 0,
    onClick: () => {}
  }

  constructor(props) {
    super(props);

    var image;
    if (this.props.likeByMe === true)
      image = imageRedHeart;
    else 
      image = imageHeart;

    this.state = {
      imageLike: image,
      hearts: this.props.hearts,
    }

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  onLike() {
    if (this.props.onLike) {
      this.props.onLike();
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
              <View style={ styles.avatarContainer }>
                <Image style={ styles.avatar } source={ icon } />
              </View>
              <View style={ styles.cellTopTextContainer }>
                <View style={ styles.cellTopTitleCoinContainer }>
                  <View style={ styles.cellTopTitleContainer }>
                    <Text style={ styles.title }>{ title }</Text>
                  </View>
                </View>
                <Text style={ styles.text }>{ distance< 0 ? 'Unknown':distance } Miles  $$</Text>
                <View style={ styles.bottomContainer }>
                  <TouchableOpacity onPress={ () => this.onLike() }>
                    <View style={ styles.heartContainer }>
                      <View style={ styles.likeWrapper }>
                        <Image style={ styles.imageLike } source={ this.props.likeByMe?imageRedHeart:imageHeart }/>
                      </View>

                      <Text style={ styles.textSmall }>
                        {
                          this.props.hearts == 0 ?
                              "0 - Be the first to like it!"
                              :
                              this.props.hearts > 1 ?
                              this.props.hearts + " Likes"
                                  :
                              this.props.hearts + " Like"
                        }
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cellTopTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
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
    justifyContent: 'flex-start',
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
  text: {
    backgroundColor: 'transparent',
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
  },
  bottomContainer: {
    flex: 1,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingRight: 5,
  },
  imageLike: {
    width: 16,
    height: 15,
  },  
  textSmall: {
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
    paddingLeft: 5,
  },
});
