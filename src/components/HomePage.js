import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  StatusBar,
  Navigator,
  TouchableOpacity,
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

//View to navigate to
const Analytics = require('./Settings').default
const CammeraView = require('./../CameraView.js').default

class HomePage extends Component {
  constructor(props) {
    super(props)
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
      </View>
    )
  }

}

export default HomePage;
