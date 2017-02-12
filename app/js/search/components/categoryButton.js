import React, { PropTypes } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

export default class CategoryButton extends React.Component {

  static propTypes = {
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.number.isRequired,
    onClickButton: PropTypes.func,
  }

  static defaultProps = {
    onClickButton: () => {},
  }

  constructor(props) {
    super(props);
    this.onClickButton = this.onClickButton.bind(this);
  }

  onClickButton() {
    if (this.props.onClickButton) {
      this.props.onClickButton();
    }
  }

  render() {
    const {
      height,
      width,
      text,
      icon,
      onClickButton,
    } = this.props;

    return (
      <View style={ [styles.container, { width, height }] }>
        <TouchableOpacity
            style={ styles.button }
            onPress={ () => onClickButton() }>
          <Image source={ icon } style={ [{ width: width - 20 }, { height: height - 20 }] }/>
          <Text style={ [styles.text, { width: width }, { height: 20 }] }>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    color: '#a4a4a3',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
