'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  TouchableOpacity,
  Navigator,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

//Camera Access
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';


//File System and unique number generator
const RNFS = require('react-native-fs');
const UUID = require('uuid/v1');

const Config = require('./config');

//Main Paths
const path = Config.picPath;

//TODO: Add a method of asking and retrieving user's weight


class CameraView extends Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.temp,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      }
    };
  }

  copyTempPic (source) {
    //This is in order to keep track of the images by date
    //TODO: possibly see if time is retrievable from device
    const utc = new Date().toJSON().slice(0,10);

    RNFS.moveFile(source, path+"/"+utc+UUID()+".jpg")
    .then(data => console.log('successfully copied file'))
    .catch(err => console.error(err));

    //Debug purposes only
    console.log("=============Current Directory==============")
    RNFS.readDir(path).then(results => console.table(results))
    .catch(err => console.error(err));
  }


  takePicture = ()=> {
    if(this.camera){
      this.camera.capture()
      .then((data) => {
        this.copyTempPic(data.path);
      }
    )
    .catch(err => console.error(err));
    }
  }

  flipCamera = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });

  }

  //TODO: Ipmplement change of  icons
  fllashToggle = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  onBackPressed = () => {
    this.props.navigator.push({
      id: 'HomePage'
    })
  }

  //TODO: Figure out a way to have settings come from bottom
  onSettingsPressed = () => {
    this.props.navigator.push({
      id: 'Settings'
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar animated hidden/>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={this.state.camera.aspect}
          captureTarget={this.state.camera.captureTarget}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          defaultTouchToFocus
          mirrorImage={false}
        >
          <View style={styles.toolbar}>
              <TouchableOpacity>
              <Icon name='ios-arrow-back'
                style= {styles.backbutton}
                onPress = {this.onBackPressed}
                size={30} />
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon name='ios-settings'
                style= {styles.settings}
                onPress = {this.onSettingsPressed}
                size={30} />
              </TouchableOpacity>
          </View>

          <View style={styles.footer}>

              <TouchableOpacity>
              <Icon name='ios-reverse-camera-outline'
                onPress={this.flipCamera}
                style= {styles.flip} size={30} />
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon name='ios-radio-button-on-outline'
                onPress={this.takePicture}
                style= {styles.camera} size={60} />
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon name='ios-flash-outline'
                style= {styles.analytics}
                onPress={this.flashOn}
                size={30}/>
              </TouchableOpacity>
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
