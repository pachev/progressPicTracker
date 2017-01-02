import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
  Text,
  View
} from 'react-native';

//external pages to load
const CameraView = require('./src/CameraView').default
const HomePage = require('./src/components/HomePage').default
const Settings = require('./src/Settings/Settings').default
const Analytics = require('./src/components/Analytics').default

class progressPicTracker extends Component {

//sets the camera view as the initial navigator
  render () {
      return (
        <Navigator
          initialRoute = {{
            id: 'HomePage'
          }}
          renderScene = {
            //calls below function for readability
            this.navigatorRenderScene
          }
          />
      );
  }


//Here are all the scenes so far in the app that are needed for the navigator
  navigatorRenderScene(route,navigator){
    _navigator = navigator;
    switch(route.id){
      case 'Analytics':
        return(<Analytics navigator = {navigator} title = 'Analytics'/>)
      case 'CameraView':
        return(<CameraView navigator = {navigator} title = 'CameraView' />)
      case 'HomePage':
        return(<HomePage navigator = {navigator} title = 'HomePage'/>)
      case 'Settings':
        return(<Settings navigator = {navigator} title = 'Settings' />)
    }
  }
}

AppRegistry.registerComponent('progressPicTracker', () => progressPicTracker);
