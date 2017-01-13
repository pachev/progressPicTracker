import React, {Component} from 'react';

import {
  AppRegistry,
  Dimensions,
  ActivityIndicator,
  Text,
  View,
  StatusBar,
  StyleSheet,
  Navigator,
  AsyncStorage,
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

const defaultSettingList = Config.settings;


class Settings extends Component {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !==s2
    });

    this.state = {
      dataSource: dataSource,
      isLoading: true

    }
  }

  componentDidMount() {
    this.fetchSettings()
  }

  componentWillReceiveProps() {
    //This function is called as the scene is rendered
    this.fetchSettings()
  }


  fetchSettings () {
    let settingList = [],
        retrievalKeys = [],
        dataSource = null;

    defaultSettingList.map((setting) => {
      retrievalKeys.push(setting.category+"-"+setting.item)
    });


    AsyncStorage.multiGet(retrievalKeys, (err, stores) => {
      stores.map( (result, i, store) => {
        let key = store[i][0];
        let val = store[i][1];

        if(val!== null) {
          settingList.push(JSON.parse(val));
        }else{
          settingList.push(defaultSettingList[i]);
        }
      })


      dataSource = this.convertArrayToMap(settingList);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(dataSource),
        isLoading: false,
      })

    }) //end of async

  }

  convertArrayToMap (list) {
    var CategoryMap = {}; // Create the blank map
    list.forEach((item) => {
      if (!CategoryMap[item.category]) {
        // Create an entry in the map for the category if it hasn't yet been created
        CategoryMap[item.category] = []
      }

      CategoryMap[item.category].push(item);

    });

    return CategoryMap;
  }


  onBackPressed = () => {
    this.props.navigator.pop({
      id: 'CameraView'
    })
  }

  onItemPressed  (data) {
    this.props.navigator.push({
      id: 'SubSettings',
      passProps: {
        data: data
      },
      title: data.item
    })
  }

  renderPreview(setting) {
    return (setting.item);

  }

  renderRow (rowData) {
      return (
          <TouchableHighlight
            onPress={() => this.onItemPressed(rowData)}
            underlayColor='#ddd'
            >
              <View style={styles.container}>
              <Text> {this.renderPreview(rowData)}</Text>
              <Text style={styles.value}> {rowData.value}</Text>
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
    if (this.state.isLoading) {
      return (
        <ActivityIndicator
          animating={true}
          style={[styles.centering, {height: 80}]}
          size="large"
          />);
        } else {

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
  centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  value: {
    color: 'grey',
    fontFamily: 'Cochin',
    fontSize: 11,
    left: 90,
    fontStyle: 'italic',
    textAlign: 'auto',

  }
});

export default Settings;
