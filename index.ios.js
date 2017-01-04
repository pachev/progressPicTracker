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
const PausedPicture = require('./src/components/PausedPicture').default
const ImageView = require('./src/components/ImageView').default

const Config = require('./src/config');

//Main Paths
const picPath = Config.picPath;
const graphPath = Config.picPath;
const RNFS = require('react-native-fs');

class progressPicTracker extends Component {

  //Creating the directories that the application will use
  pathCreate = RNFS.exists(picPath)
  .then((check) => {
    console.log("checking: " + check)
    if(!check){
      RNFS.mkdir(picPath).then(console.log("success creating Pic directory"))
      .catch(err => console.log("Dir Error: ",err));
    }
    return Promise.all([RNFS.exists(graphPath)])
  })
  .then((check) => {
    console.log("checking: " + check)
    if(!check){
      RNFS.mkdir(picPath).then(console.log("success creating graph Directory"))
      .catch(err => console.log("Dir Error: ",err));
    }
  })
  .catch(err => console.error(err));

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
        return(<CameraView navigator = {navigator} {...route.passProps} title = 'CameraView' />)
      case 'HomePage':
        return(<HomePage navigator = {navigator} title = 'HomePage'/>)
      case 'Settings':
        return(<Settings navigator = {navigator} title = 'Settings' />)
      case 'PausedPicture':
        return(<PausedPicture navigator = {navigator} {...route.passProps} title = 'PausedPicture' />)
      case 'ImageView':
        return(<ImageView navigator = {navigator} {...route.passProps} title = 'ImageView' />)
    }
  }
}

AppRegistry.registerComponent('progressPicTracker', () => progressPicTracker);
