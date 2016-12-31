'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';


const RNFS = require('react-native-fs');
const UUID = require('uuid/v1');

class CameraView extends Component {
  constructor(props) {
    super(props);


  }

  copyTempPic (source) {
    //This is in order to keep track of the images by date
    //TODO: possibly see if time is retrievable from device
    const utc = new Date().toJSON().slice(0,10);

    //The main path of the pictures sotred
    //TODO: generate all these paths the first time application starts
    const path = RNFS.MainBundlePath + "/pics";
    RNFS.exists(path)
      .then((check) => {
        console.log("checking: " + check)
        if(!check){
            RNFS.mkdir(path)
        }
      })
      .catch(err => console.error(err));

      RNFS.moveFile(source, path+"/"+utc+UUID()+".jpg")
        .then(data => console.log('success: ', data))
        .catch(err => console.error(err));

      //Debug purposes only
      console.log("=============Current Directory==============")
      RNFS.readDir(path).then(results => console.table(results))
                        .catch(err => console.error(err));
  }


  takePicture() {
    this.camera.capture()
      .then((data) => {
        this.copyTempPic(data.path);
      }
    )
    .catch(err => console.error(err));
  }

  //TODO: Ipmplement this function
  flipCamera() {
    console.log(this.camera.type)
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          captureTarget = {Camera.constants.CaptureTarget.temp}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <View style={styles.toolbar}>
              <Icon name='ios-arrow-back'
                style= {styles.backbutton}
                size={30} />
              <Icon name='ios-settings'
                style= {styles.settings}
                size={30} />
          </View>

          <View style={styles.footer}>
              <Icon name='ios-reverse-camera-outline'
                onPress={this.flipCamera.bind(this)}
                style= {styles.flip} size={30} />
              <Icon name='ios-radio-button-on-outline'
                onPress={this.takePicture.bind(this)}
                style= {styles.camera} size={60} />
              <Icon name='ios-analytics-outline'
                style= {styles.analytics}
                size={30}/>
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backbutton: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    marginRight: 270,

  },
  toolbar: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingTop: 20

  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30

  },
  settings: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
  },
  flip: {
    marginLeft: -30,
    top: 10,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  analytics: {
    marginLeft: -30,
    top: 10,
    left: 60,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  camera: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  }
});

export default CameraView;
