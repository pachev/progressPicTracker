'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Image,
  Button,
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

const Modal = require('react-native-modalbox');

const Config = require('./config');

//Main Paths
const path = Config.picPath;


//TODO: Add a method of asking and retrieving user's weight


class CameraView extends Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      showSettings: false,
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.temp,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
    };
  }

  pausePicture (path) {
    this.props.navigator.push({
      id: 'PausedPicture',
      passProps: {
        picPath: path,
      }
    })
  }



  takePicture = ()=> {
    if(this.camera){
      this.camera.capture()
      .then((data) => {
        this.pausePicture(data.path);
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
    console.log("back pressed");
    this.props.navigator.push({
      id: 'HomePage'
    })
  }

  //TODO: Figure out a way to have settings come from bottom
  onSettingsPressed = () => {
    console.log("Settings pressed")
    this.setState({
      showSettings: true
    })
  }


  closeSetting =() => {
    console.log("closeSetting");
    this.setState ({
    showSettings: false
  })
  }


  render() {
    const close = <TouchableOpacity
      onPress={() => this.closeSetting()}
      style={[styles.btn, styles.btnModal]}>
      <Text style={{color: 'white', fontWeight:'bold', fontSize: 23}}>
        X
      </Text>
    </TouchableOpacity>

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
                onPress = {this.onSettingsPressed}
                style= {styles.settings}
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
        <Modal style={styles.modal}
          position={"center"}
          isOpen={this.state.showSettings}
          backdropContent={close}
          >
          <Text style={styles.text}>Where all the settings will go</Text>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    padding: 10
  },
  btnModal: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    backgroundColor: "transparent"
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300
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
