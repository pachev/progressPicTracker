import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  AsyncStorage,
  StatusBar,
  Dimensions,
  Navigator,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';

//TODO: Fix the displaying of weight


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
    const allWeights = null;


    this.state = {
      dataSource : picDataSource,
      isLoading : true,
      allWeights: allWeights

    }
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
        results.reverse().forEach(file => {
          const date = file.name.slice(0,10);
          const ext = file.name.split(".").pop();

          if(!(date in dates) && ext === 'jpg'){
            dates[date] = []
          }

          if(ext === 'jpg')
            dates[date].push(file.path)

        })
        console.log(dates);
        return dates;
      })
      .then ((dates) => {
        let datablob = {},
            sectionIds = [],
            rowIds = [],
            retrievalKeys = [],
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

             retrievalKeys.push(uuid)
             rowIds[i].push(uuid);

             //unique way of grabbing data required for datasource
             datablob[key + ':' + uuid] = date;
           })
           i++;
        }

        return [retrievalKeys, datablob, sectionIds, rowIds];
      })
      .then((results) => {
        let allWeights = {},
        datablob = results[1],
        sectionIds = results[2],
        rowIds = results[3];

        AsyncStorage.multiGet(results[0], (err, stores) => {
          stores.map( (result, i, store) => {
            let key = store[i][0];
            let val = store[i][1];
            if(val !==null){
              measurements = JSON.parse(val)
              allWeights[key] = measurements.weight
            }else{ allWeights[key] = 0}
          });
          this.setState({
            isLoading: false
          })

        })

        this.setState ({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(datablob,
                                            sectionIds, rowIds),
          allWeights: allWeights,
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

  goToImageView (path) {
    this.props.navigator.push({
      id: 'ImageView',
      passProps: {
        picPath: path
      }
    })

  }


//single row rendering function
  renderDateRow (rowData) {

    const key = rowData.slice(-40).slice(0,-4);
    const weight = this.state.allWeights[key]


    return (
      <TouchableHighlight
        onPress = {() => this.goToImageView(rowData)}>
      <View style={styles.imageBox}>
        <Image style={styles.image} source={{uri: 'file://'+rowData}}/>
        <Text >Weight: {weight}</Text>
      </View>
      </TouchableHighlight>

    )
  }

//single Header rendering function
  renderDateHeader (sectionData, sectionID) {

    //TODO: add days passed to section

    return (
      <View style={styles.headerSection}>
        <Text style={{color: 'white'}}>{sectionID}</Text>
      </View>
    );
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
      console.log(this.state.dataSource)

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
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderDateRow.bind(this)}
            renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderSectionHeader={this.renderDateHeader.bind(this)}
            />
      </View>
    )
  }
}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  text: {
    color: '#8E8E8E',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  imageBox: {
    backgroundColor: 'white',
  },
  headerSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c9d1'
  },
   centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

export default HomePage;
