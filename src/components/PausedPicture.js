'use strict';
import React, { Component } from 'react';
import {
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';


//File System and unique number generator
const RNFS = require('react-native-fs');
const UUID = require('uuid/v1');

const Config = require('../config');

//Main Paths
const path = Config.picPath;


class PausedPicture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      picPath : props.picPath
    }

  }
  goToImageView (path) {
    this.props.navigator.push({
      id: 'ImageView',
      passProps: {
        picPath: path
      }
    })

  }

  goToCameraView (){
    this.props.navigator.pop({
      id: 'CameraView'
    })
  }

  copyTempPic = (source) => {
    //This is in order to keep track of the images by date
    //TODO: possibly see if time is retrievable from device
    const utc = new Date().toJSON().slice(0,10);
    const newPath = path+"/"+utc+UUID()+".jpg"

    RNFS.moveFile(source, newPath)
    .then(data => console.log('successfully copied file'))
    .then(this.goToImageView(this.state.picPath))
    .catch(err => console.error(err));

    //Debug purposes only
    console.log("=============Current Directory==============")
    RNFS.readDir(path).then(results => console.table(results))
    .catch(err => console.error(err));
  }

  render(){
    return (
      <View style = {styles.container}>
        <Image style={styles.image} source={{uri: 'file://'+this.state.picPath}}/>
        <View style={styles.footer}>
        <TouchableOpacity style={styles.button1}
          onPress={() => this.goToCameraView()}>
        <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2}
          onPress={() => this.copyTempPic(this.state.picPath)}>
        <Text style={styles.text}>keep</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  button1: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  button2: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'white',
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
    height: Dimensions.get('window').height / 1.2,
  },
  imageBox: {
    backgroundColor: 'white',
  },
  footer: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});


export default PausedPicture;
