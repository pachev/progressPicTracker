import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  Image,
  StyleSheet,
  StatusBar,
  Navigator,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';



//Icons from ionic
import Icon from 'react-native-vector-icons/Ionicons';

//Styles for the universal toolbar
import toolbarStyle from './Styles';

const Config = require('../config')

//File System
const RNFS = require('react-native-fs');

//Main Paths
const path = Config.picPath;

class HomePage extends Component {

  constructor(props) {
    super(props)

    const picDataSource = new ListView.DataSource({
      getSectionHeaderData: this.getSectionData,
      getRowData: this.getRowData,
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !==s2
    });

    this.state = {
      dataSource : picDataSource
    };
  }

  componentDidMount() {
    //This function is called as the scene is rendered
    //http://stackoverflow.com/questions/34393109/
    this.fetchProgressPics()
  }

  fetchProgressPics () {

    RNFS.readDir(path)
      .then((results) => {
        //Seperates results into dates and file path for ListView
        let dates = {}
        results.forEach(file => {
          const date = file.name.slice(0,10);
          const ext = file.name.split(".").pop();

          if(!(date in dates) && ext === 'jpg'){
            dates[date] = []
          }
          else{
            if(ext === 'jpg')
            //resolves bad filepath issues for image source
              dates[date].push(file.path)
          }

        })

        return dates;
      })
      .then ((dates) => {
        let datablob = {},
            sectionIds = [],
            rowIds = [],
            i = 0;

        // iterate over date object to set headers and row data
        for (key in dates) {

          //each header is a date
           sectionIds.push(key)
          //each row is an array of elements to be rendered
           rowIds[i] = []
           dates[key].forEach((date) => {

             //getting unique identifier without extension
             //the uuid is the last 40 characters of the filename minus ext
             const uuid = date.slice(-40).slice(0, -4);

             rowIds[i].push(uuid);

             //unique way of grabbing data required for datasource
             datablob[key + ':' + uuid] = date;
           })
           i++;
        }

        this.setState ({

          dataSource: this.state.dataSource.cloneWithRowsAndSections(datablob,
                                            sectionIds, rowIds)
        })
      })
      .catch(err => console.error(err));
  }

// These two functions dictate how Listview datasource obtains it's values
  getSectionData = (dataBlob, sectionID) => {
    return dataBlob[sectionID];
  }
  getRowData = (dataBlob, sectionID, rowID) => {
    return dataBlob[sectionID + ':' + rowID];
  }


//Navigator functions for scene transitions
//TODO: possibly switch to navigatorIOS
  onCameraPressed = () => {
    this.props.navigator.push({
      id: 'CameraView'
    })
  }

  onAnalyticsPressed = () => {
    this.props.navigator.push({
      id: 'Analytics'
    })
  }


//single row rendering function
  renderDateRow (rowData) {

    return (
      <View style={toolbarStyle.imageBox}>
      <TouchableHighlight>
        <Image style={toolbarStyle.image} source={{uri: 'file://'+rowData}}/>
      </TouchableHighlight>
      </View>
    )
  }

//single Header rendering function
  renderDateHeader (sectionData, sectionID) {
    return (
      <View style={toolbarStyle.headerSection}>
        <Text style={{color: 'white'}}>{sectionID}</Text>
      </View>
    );
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar animated hidden/>
        <View style={toolbarStyle.toolbar}>
          <TouchableOpacity>
          <Icon name='ios-camera-outline'
                style={toolbarStyle.toolbarButton}
                onPress = {this.onCameraPressed}
                size = {25}/>
          </TouchableOpacity>
          <Text style={toolbarStyle.toolbarTitle}>Progress Pic Tracker</Text>
          <TouchableOpacity>
          <Icon name='ios-analytics-outline'
                style={toolbarStyle.toolbarButton}
                onPress = {this.onAnalyticsPressed}
                size = {25}/>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderDateRow.bind(this)}
            renderSectionHeader={this.renderDateHeader.bind(this)}
            />
        </ScrollView>
      </View>
    )
  }

}

export default HomePage;
