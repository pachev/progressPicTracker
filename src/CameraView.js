'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  ActivityIndicator,
  Image,
  Button,
  ListView,
  TouchableOpacity,
  Navigator,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicatorIOS,
} from 'react-native'

//Camera Access
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import FlashIcon from 'react-native-vector-icons/MaterialIcons';


//File System and unique number generator
const RNFS = require('react-native-fs');
const UUID = require('uuid/v1');


const Config = require('./config');

//Main Paths
const path = Config.picPath;


const Modal = require('react-native-modalbox')

//TODO: refractor toolbar as seperate component to be called


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
      },
      flashIcon: 'flash-auto',
      cameraIcon: 'camera-front',
      isOpen: false,
      modalLoading: false,
      firstProgress: null,
      currentProgress: null
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
    let newType,
        cameraIcon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
      cameraIcon = 'camera-rear'

    } else if (this.state.camera.type === front) {
      newType = back;
      cameraIcon = 'camera-front'
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
      cameraIcon: cameraIcon
    });

  }

  //TODO: Ipmplement change of  icons
  flashToggle = () => {
    let newFlashMode,
        newFlashIcon;

    console.log("inside fllashToggle");
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
      newFlashIcon = 'flash-on';
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
      newFlashIcon = 'flash-off';
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
      newFlashIcon = 'flash-auto';
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
      flashIcon: newFlashIcon
    });

    console.log("currentState: ", this.state.flashIcon);
    console.log("setSate: ", newFlashIcon);
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
    this.props.navigator.push({
      id: 'Settings'
    })
  }

  showProgress = () => {
    const first = Config.firstProgressKey;
    const current = Config.currentProgressKey;
    console.log("Shwoing Progress");
    this.setState({
      isOpen: true,
      modalLoading: true
    })

    AsyncStorage.multiGet([first, current], (err, stores) => {
      let firstPath = stores[0][1];
      let secondPath = stores[1][1];

      this.setState({
        firstProgress: firstPath,
        currentProgress: secondPath,
        modalLoading: false
      });

      console.log("firstPath:", firstPath);
      console.log("secondPath:", secondPath);
    })
  }

  closeProgress = () => {
    this.setState({
      isOpen: false
    })
  }





  render() {
    let BottomModal = null;

    const xClose= <View
                    style={[styles.button, styles.buttonModal]}
                    >
                    <Button
                    onPress= {this.closeProgress}
                    color="white"
                    title="X"
                    />
                </View>;

                if(this.state.modalLoading) {
                  BottomModal=
                  <Modal
                    isOpen={this.state.isOpen}
                    onClosed={()=>this.setState({isOpen:false})}
                    position={"center"}
                    backdropContent={xClose}
                    style={styles.modal}
                    >
                    <ActivityIndicator
                      animating={true}
                      style={[styles.centering, {height: 80}]}
                      size="large"
                      />
                  </Modal>
                }else {


                  BottomModal =
                  <Modal
                    isOpen={this.state.isOpen}
                    onClosed={()=>this.setState({isOpen:false})}
                    position={"center"}
                    backdropContent={xClose}
                    style={styles.modal}
                    >
                    <View style={{flex:1, flexDirection: 'row'}}>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{color: 'white'}}>
                          Before:
                        </Text>
                        <Image style={styles.image} source={{uri: 'file://'+this.state.firstProgress}}/>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={{color: 'white'}}>
                          After:
                        </Text>
                        <Image style={styles.image} source={{uri: 'file://'+this.state.currentProgress}}/>
                      </View>
                    </View>
                  </Modal>
                }
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
              <Icon name='md-arrow-round-back'
                onPress = {this.onBackPressed}
                style= {styles.backbutton}
                size={30} />
              <Icon name='ios-body-outline'
                onPress = {this.showProgress}
                style= {{color:'white', right:130}}
                size={30} />
              <Icon name='ios-settings'
                onPress = {this.onSettingsPressed}
                style= {styles.settings}
                size={30} />
          </View>

          <View style={styles.footer}>

              <TouchableOpacity>
              <FlashIcon name={this.state.cameraIcon}
                onPress={this.flipCamera}
                style= {styles.flip} size={30} />
              </TouchableOpacity>
              <TouchableOpacity>
              <Icon name='ios-radio-button-on-outline'
                onPress={this.takePicture}
                style= {styles.camera} size={60} />
              </TouchableOpacity>
              <TouchableOpacity>
              <FlashIcon name={this.state.flashIcon}
                style= {styles.analytics}
                onPress={this.flashToggle}
                size={30}/>
              </TouchableOpacity>
          </View>
        </Camera>
        {BottomModal}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c4c9d1'
  },
  backbutton: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
    marginRight: 271,

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
    right: 60,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  analytics: {
    marginLeft: -30,
    top: 10,
    left: 90,
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white'
  },
  camera: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: 'white',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    height: 400,
  },
  button: {
    margin: 10,
    backgroundColor: '#3b5998',
    padding: 10,
  },
  buttonModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  image: {
    padding: 5,
    width: 170,
    height: 320,
  },
  separator: {
    padding: 1,
    height: 320,
    top: 17,
    backgroundColor: '#c0c0c0',
    width: StyleSheet.hairlineWidth,
  },
});

export default CameraView;
