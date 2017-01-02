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

//File System
const RNFS = require('react-native-fs');


class HomePage extends Component {

  constructor(props) {
    super(props)

    var ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.state = {
      dataSource : ds
    };
  }

  componentDidMount() {
    this.fetchProgressPics()
  }

  fetchProgressPics () {
    const path = RNFS.MainBundlePath + "/pics";

    RNFS.readDir(path)
      .then((results) => {
          this.setState ({
            dataSource: this.state.dataSource.cloneWithRows(results)
          })
      })
      .catch(err => console.error(err));
  }

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

  renderRow (rowData) {
    const path = rowData.path
    return (
      <TouchableHighlight>
        <Image style={toolbarStyle.image} source={{uri: 'file://'+path}}/>
      </TouchableHighlight>
    )

  }
  render() {
    return (
      <View>
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
            renderRow={this.renderRow.bind(this)}
            />
        </ScrollView>
      </View>
    )
  }

}

export default HomePage;
