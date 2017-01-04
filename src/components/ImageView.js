
'use strict';
import React, { Component } from 'react';
import {
  Image,
  Dimensions,
  AsyncStorage,
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
const mainPicPath = Config.picPath;


class ImageView extends Component {
  constructor(props) {
    super(props);

    const measurements = {
      weight: 0,
      waist: 0,
      hip: 0,
      biceps: 0,

    };

    this.state = {
      picPath : props.picPath,
      key: props.picPath.slice(-40).slice(0,-4),
      measurements: measurements

    }

  }

  componentDidMount() {
    //This function is called as the scene is rendered
    //http://stackoverflow.com/questions/34393109/
    this.loadMeasurements()
  }

  loadMeasurements () {

      AsyncStorage.getItem(this.state.key)
      .then(value => {
        console.log(value)
        if(value !== null) {
          this.setState({
            measurements: JSON.parse(value)
          })
        }
      })
      .catch(error => console.error(error))

  }

  saveMeasurements () {
    const measurements = {
      weight: 10,
      waist: 10,
      hip: 10,
      biceps: 10,

    };
    AsyncStorage.setItem(this.state.key, JSON.stringify(measurements))
    .then(value => console.log(value))
    .catch(err => console.error(err))

  }

  render () {
    return (
      <View style = {styles.container}>
        <Text>
        Weight =  {this.state.measurements.weight}
        </Text>
        <TouchableOpacity style={styles.button2}
          onPress={() => this.saveMeasurements()}>
        <Text style={styles.text}>save</Text>
        </TouchableOpacity>
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


export default ImageView;
