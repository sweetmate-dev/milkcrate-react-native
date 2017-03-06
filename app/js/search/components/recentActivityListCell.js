import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
  Alert,
} from 'react-native';

import * as commonStyles from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const star = require('../../../assets/imgs/star.png');
const heart = require('../../../assets/imgs/heart.png');

export default class RecentActivityListCell extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    avatar: PropTypes.number.isRequired,
    time: PropTypes.number,
    heart: PropTypes.number,
    rating: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(14),
    heart: 0,
    rating: 0,
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

  onLike() {
    alert("onLike");
  }

  render() {
    const {
      height,
      width,
      name,
      description,
      avatar,
      time,
      hearts,
      rating,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.avatarsContainer }>
            <Image style={ styles.avatar } source={ avatar }/>
          </View>
          <View style={ styles.mainContentContainer }>
            <View style={ styles.contentTopContainer }>
              <View style={ styles.names_timeContainer }>
                <Text style={ styles.textName }>{ name }</Text>
                <Text style={ styles.textSmall }>{ time } min ago</Text>
              </View>
              <View style={ styles.ratingContainer }>
                <Text style={ styles.textSmall }>{ rating } </Text>
                <Image style={ styles.imageStar } source={ star } />
              </View>
            </View>
            <Text style={ styles.textDescription }>{ description }</Text>
            <View style={ styles.like_coinContainer }>
              <View style={ styles.heartContainer }>
                <TouchableHighlight onPress={ () => this.onLike() }>
                  <View style={ styles.likeWrapper }>
                    <Image style={ styles.imageLike } source={ heart }/>
                  </View>  
                </TouchableHighlight>

                <Text style={ styles.textSmall }>

                {
                  hearts != 0 ? hearts : hearts + " - Be the first to like it!"
                }
                </Text>
              </View>
            </View>
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
    paddingLeft: 5,
    paddingRight: 15,
    height: commonStyles.hp(14),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderStyle: 'solid',
  },
  avatarContainer: {
    paddingVertical: 5,
  },
  mainContentContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  contentTopContainer:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  names_timeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 2,
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
    flex: 2,
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
  },
  like_coinContainer: {
    flex : 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  imageLike: {
    width: 16,
    height: 15,
  },
  imageStar: {
    width: 16,
    height: 16,
    marginLeft: 3,
  },
  ratingContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // textValue: {
  //   color: commonColors.grayMoreText,
  //   fontFamily: 'Open Sans',
  //   fontSize: 12,
  // },
});
