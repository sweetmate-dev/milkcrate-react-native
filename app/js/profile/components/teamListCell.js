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
import EntypoIcon from 'react-native-vector-icons/Entypo';
const imageHeart = require('../../../assets/imgs/heart.png');
const imageRedHeart = require('../../../assets/imgs/heart_red.png');

export default class TeamListCell extends Component {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    average: PropTypes.number,
    me: PropTypes.number,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    me: 0,
    average: 0,
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
      icon,
      average,
      me,
      onClick,
    } = this.props;

    return (
      <TouchableHighlight onPress={ () => onClick() }>
        <View style={ styles.cellContainer }>
          <View style={ styles.avatarContainer }>
            {icon&&<Image style={ styles.imageComcast } source={{ uri: icon }} resizeMode="contain"/>}
          </View>
          <View style={ styles.mainContainer }>
            <View style={ styles.valCol }>
              <Text style={styles.textName}>Avg.</Text>
              <Text style={styles.textValue}>{average}</Text>
            </View>
            <View style={ styles.valCol }>
              <Text style={styles.textName}>Me</Text>
              <Text style={[styles.textValue, {color:(me<0?'#F59174':'#6BA496')}]}>
                {me>0?'+' + me:'-' + me}
              </Text>
            </View>
            <EntypoIcon style={ styles.rightIcon } name="chevron-thin-right" size={ 16 } color={ commonColors.grayMoreText }/>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  cellContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 11,
    paddingHorizontal: 8,
    // height: commonStyles.hp(14),
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,
    borderTopWidth: 1,
    borderTopColor: commonColors.line,
    borderStyle: 'solid',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  avatarContainer: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageComcast: {
    width: 100,
    height: 38,
  },
  textName: {
    flex:1,
    color: commonColors.grayMoreText,
    fontFamily: 'Open Sans',
    fontSize: 12,
    backgroundColor: 'transparent',
    textAlign:'center'
  },
  textValue: {
    flex:1,
    color: '#808080',
    fontFamily: 'Open Sans',
    fontSize: 14,
    backgroundColor: 'transparent',
    textAlign:'center'
  },
  valCol: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
  },
  rightIcon: {
    paddingTop: 2.5,
    paddingLeft: 30,
    alignSelf: 'center',
  },
});
