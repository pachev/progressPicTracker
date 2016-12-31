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
import FileSystem from 'react-native-filesystem';
import FS from 'react-native-fs';


const RNFS = require('react-native-fs');

class CameraView extends Component {
  constructor(props) {
    super(props);

    this.Camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.disk,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      isRecording: false
    }

  }


  takePicture() {
    const date = Date.now();
    this.camera.capture()
      .then((data) => {
        console.log('data: ' + data.data);
        console.log('path: ' + data.path);
        const date = Date.now();
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
              <Icon name='ios-arrow-back' style= {styles.backbutton} size={30} />
              <Icon name='ios-settings' style= {styles.settings} size={30} />
          </View>

          <View style={styles.footer}>
              <Icon name='ios-reverse-camera-outline' onPress={this.flipCamera.bind(this)} style= {styles.flip} size={30} />
              <Icon name='ios-radio-button-on-outline' onPress={this.takePicture.bind(this)} style= {styles.camera} size={60} />
              <Icon name='ios-analytics-outline' style= {styles.analytics} size={30} />
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
