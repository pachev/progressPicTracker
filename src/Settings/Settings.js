import React, {Component} from 'react';

import {
  AppRegistry,
  Dimensions,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';

//Styles for the universal toolbar
import toolbarStyle from '../components/Styles';

const RNFS = require('react-native-fs');
const UUID = require('uuid/v4')

const Config = require('../config');

const settingList = Config.settings;


class Settings extends Component {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !==s2
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(Config.convertArrayToMap(settingList)),

    }
  }


  onBackPressed = () => {
    this.props.navigator.pop({
      id: 'CameraView'
    })
  }

  renderRow (rowData) {
      return (
          <TouchableHighlight >
              <View style={styles.container}>
              <Text> {rowData.item}</Text>
              <View>
                  <Icon name='ios-arrow-forward'
                      style= {styles.frontButton}
                      size={15} />
                  </View>
            </View>
          </TouchableHighlight>
      )

  }

  renderSectionHeader (sectionData, category) {
      return (
      <View style={styles.headerSection}>
        <Text style={styles.text}>{category}</Text>
      </View>
      )

  }

  renderSeparator (sectionId, rowId) {
    let newRow = rowId + UUID();
    return (
      <View key={newRow} style={styles.separator} />
    )
  }

  render() {
    return (
      <View>
        <StatusBar animated hidden/>
        <View style={toolbarStyle.toolbar}>
          <TouchableOpacity>
          <Icon name='ios-arrow-back'
                style={toolbarStyle.toolbarButton}
                onPress = {this.onBackPressed}
                size = {25}/>
          </TouchableOpacity>
          <Text style={toolbarStyle.toolbarTitle}>Settings</Text>
        </View>

              <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow.bind(this)}
                  renderSectionHeader={this.renderSectionHeader.bind(this)}
                  renderSeparator={this.renderSeparator.bind(this)}
              />

      </View>
    )
  }

}

const styles = StyleSheet.create({

  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    width: Dimensions.get('window').width/1.2,
    left: 20,
    backgroundColor: '#8E8E8E',
  },
  headerSection: {
    flex: 1,
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#EAEAEA'
  },
  text: {
    marginLeft: 12,
    fontSize: 16,
  },
  container: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frontButton: {
    backgroundColor: 'rgba(0,0,0,0)',

  },
});

export default Settings;
