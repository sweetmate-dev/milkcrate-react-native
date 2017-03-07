import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';

import * as commonStyles from '../../styles/comonStyles';
import * as commonColors from '../../styles/commonColors';

const point = require('../../../assets/imgs/point.png');
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
    onClick: PropTypes.func,
  }

  static defaultProps = {
    width: commonStyles.screenWidth,
    height: commonStyles.hp(14),
    heart: 0,
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
      coins,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.avatarsContainer }>
            <Image style={ styles.avatar } source={ avatar }/>
          </View>
          <View style={ styles.mainContentContainer }>
            <View style={ styles.names_timeContainer }>
              <Text style={ styles.textName }>{ name }</Text>
              <Text style={ styles.textSmall }>{ time } min ago completed</Text>
            </View>
            <Text style={ styles.textDescription }>{ description }</Text>
            <View style={ styles.like_coinContainer }>
              <TouchableOpacity onPress={ () => this.onLike() }>
                <View style={ styles.heartContainer }>
                  <View style={ styles.likeWrapper }>
                    <Image style={ styles.imageLike } source={ heart }/>
                  </View>  
  
                  <Text style={ styles.textSmall }>

                  {
                    hearts != 0 ? hearts : hearts + " - Be the first to like it!"
                  }
                  </Text>
                </View>
              </TouchableOpacity>  
              <View style={ styles.pointContainer }>
                <Image style={ styles.imagePoint } source={ point }>
                  <Text style={ styles.textPoint }>+{ coins }</Text>            
                </Image>
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    // height: commonStyles.hp(14),
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
    flex: 1,
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    // marginVertical: 5,
    marginTop: 5,
  },
  like_coinContainer: {
    flex: 1,
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
    paddingVertical: 5,
    paddingRight: 5,
  },
  imageLike: {
    width: 16,
    height: 15,
  },  
  pointContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePoint: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
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
