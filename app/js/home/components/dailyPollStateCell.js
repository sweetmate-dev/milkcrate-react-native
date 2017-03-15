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

export default class DailyPollStateCell extends Component {

  static propTypes = {
    percent: PropTypes.number,
    description: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    bottomLine: PropTypes.bool,
  }

  static defaultProps = {
    percent: 0,
    selected: false,
    bottomLine: true,
  }

  constructor(props) {

    super(props);
  }

  render() {
    const {
      percent,
      description,
      selected,
      bottomLine,
    } = this.props;

    return (
      <View style={ [styles.container, bottomLine ? styles.bottomLine : null] }>
        <View style={ [styles.cellBackgroundContainer, { backgroundColor: selected ? commonColors.percentListCellStrongBackground : commonColors.percentListCellWeakBackground }] }>
          <View style = { [styles.cellPercentContainer, { backgroundColor: selected ? commonColors.percentListCellStrongBackground : commonColors.percentListCellWeakBackground }, { width: screenWidth / 100 * percent }] }>
          </View>
          <View style= { styles.cellContainer }>
            <Text style={ styles.textPercent_Select }>{ percent }%</Text>
            <Text style={ selected == true ? styles.textPercent_Select : styles.textDescription }>{ description }</Text>
          </View>
        </View>  
      </View>  
    );
  }
}
const styles = StyleSheet.create({
  container: {
    
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: commonColors.line,    
  },
  textDescription: {
    color: commonColors.grayText,
    fontFamily: 'Open Sans',
    fontSize: 14,
    textAlign: 'left',
    backgroundColor: 'transparent',    
  },
  textPercent_Select: {
    color: commonColors.title,
    fontFamily: 'OpenSans-Semibold',
    fontSize: 14,
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 10,
  },
  cellBackgroundContainer: {    
  },
  cellPercentContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  cellContainer: {
    flexDirection: 'row',
    paddingVertical: 13,
  },
});
