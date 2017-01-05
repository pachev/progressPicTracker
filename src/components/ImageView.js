
'use strict';
import React, { Component } from 'react';
import {
  Image,
  Dimensions,
  ScrollView,
  NumberInput,
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
//For forms
const TFORM = require('tcomb-form-native');

//Main Paths
const mainPicPath = Config.picPath;


const Form = TFORM.form.Form;

// defining the measurements model for the form
var Measurements = TFORM.struct({
  weight: TFORM.maybe(TFORM.Number),
  waist: TFORM.maybe(TFORM.Number),
  hip: TFORM.maybe(TFORM.Number),
  biceps: TFORM.maybe(TFORM.Number),
});

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
      value: measurements,

    }

  }

  componentDidMount() {
    //This function is called as the scene is rendered
    //http://stackoverflow.com/questions/34393109/
    this.loadMeasurements()
  }

  onChange = (value) => {
    this.setState({
      value: value
    })
  }

  onPress = () => {
    var value = this.refs.form.getValue();
    if (value) {
      this.saveMeasurements();
    }


  }

  deleteFile = () => {
    RNFS.unlink(this.state.picPath)
    .then(() => {
      console.log('FILE DELETED');
      this.goToCameraView();
    })
    .catch((err) => {
      console.log(err.message);
    });

  }

  loadMeasurements () {

      AsyncStorage.getItem(this.state.key)
      .then(value => {
        console.log(value)
        if(value !== null) {
          this.setState({
            value: JSON.parse(value)
          })
        }
      })
      .catch(error => console.error(error))

  }

  saveMeasurements () {
    AsyncStorage.setItem(this.state.key, JSON.stringify(this.state.value))
    .then(value => console.log("Success Saving Measurements"))
    .catch(err => console.error(err))

    this.goToCameraView();

  }

  goToCameraView (){
    this.props.navigator.resetTo({
      id: 'HomePage'
    })
  }

  render () {
    return (
      <ScrollView style = {styles.container}>
        <Image style={styles.image} source={{uri: 'file://'+this.state.picPath}}/>
        <View>
        <Form
          ref="form"
          type={Measurements}
          value = {this.state.value}
          onChange = {this.onChange}
        />
        </View>
        <View style={styles.footer}>
        <TouchableOpacity style={styles.button1}
          onPress={this.deleteFile}>
        <Text style={styles.text}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button2}
          onPress={this.onPress}>
        <Text style={styles.text}>Save</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    margin: 2,
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
    height: Dimensions.get('window').height / 1.7,
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
