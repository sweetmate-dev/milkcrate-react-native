import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} from 'react-native';

import {Actions} from 'react-native-router-flux';
import SearchBar from './searchBar';
import CategoryButton from './categoryButton';

const { width, height } = Dimensions.get('window');

const coffee = require('../../../assets/imgs/stickers/coffee.png');
const star = require('../../../assets/imgs/star.png');

const items = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

export default class SearchListForm extends Component {
  constructor(props) {
    super(props);

      var dataSource = new ListView.DataSource(
          {rowHasChanged: (r1, r2) => r1.lister_url !== r2.lister_url});
      this.state = {
          dataSource: dataSource.cloneWithRows(items)
      };
  }

  componentWillReceiveProps(newProps) {

    if (newProps.status == 'search_category_request') {

    } else if (newProps.status == 'search_category_success') {

    } else if (newProps.status == 'search_category_error') {

    }
  }

  onCellPressed () {
    alert("onCellPressed");
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this.onCellPressed()}
                          underlayColor='#dddddd'>
        <View style={ styles.cellContainer }>
          <View style={ styles.cellTopContainer }>
            <Image style={ styles.avatar } source={ coffee } />
            <View style={ styles.cellTopTextContainer }>
              <View style={ styles.cellTopTitleRatingContainer }>
                <View style={ styles.cellTopTitleContainer }>
                  <Text style={ styles.title }>Elixr Coffee Roasters</Text>
                </View>
                <View style={ styles.cellTopRatingContainer }>
                  <Text style={ styles.text }>4.8</Text>
                  <Image style={ styles.star } source={ star } />
                </View>
              </View>
              <Text style={ styles.text }>1.2 Miles  $$</Text>
            </View>
          </View>
          <View style={ styles.cellBottomContainer }>
            <Text style={ styles.dscription }>Great Coffee, Great People, Great Service</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { status } = this.props;
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  cellContainer: {
    height: 83,
    width,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: '#d4ebf6',

  },
  cellTopContainer: {
    flexDirection: 'row',
    flex:3,
    alignItems: 'center',
  },
  cellTopTextContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
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