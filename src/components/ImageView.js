
'use strict';
import React, { Component } from 'react';
import {
  Image,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  NumberInput,
  AsyncStorage,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';


const _ = require('lodash')
//File System and unique number generator
const RNFS = require('react-native-fs');
const UUID = require('uuid/v1');

const Config = require('../config');
//For forms
const TFORM = require('tcomb-form-native');

//Main Paths
const mainPicPath = Config.picPath;

const stylesheet = _.cloneDeep(TFORM.form.Form.stylesheet);

stylesheet.fieldset = {
  flexDirection: 'row'
};
stylesheet.formGroup.normal.flex = 1;
stylesheet.formGroup.error.flex = 1;
stylesheet.formGroup.normal.padding = 5;
stylesheet.formGroup.error.padding = 5;


const options = {
  stylesheet: stylesheet,
  i18n: {
    optional: '',
    required: ''
  }
};

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
      dateTaken: props.dateTaken

    };

    this.state = {
      picPath : props.picPath,
      key: props.picPath.slice(-40).slice(0,-4),
      value: measurements,
      isLoading: true,
      lastTwo: null,
      firstTwo: null,

    }

  }

  componentDidMount() {
    //This function is called as the scene is rendered
    //http://stackoverflow.com/questions/34393109/
    this.loadMeasurements();
  }

  onChange = (value) => {
    let loadedValue = value;
    loadedValue["dateTaken"] = this.props.dateTaken

    this.setState({
      value: loadedValue
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
    })
    .catch((err) => {
      console.log(err.message);
    });


    if(this.state.picPath === this.state.lastTwo[1]) {
      AsyncStorage.setItem(Config.currentProgressKey, this.state.lastTwo[0])
      .then(()=> {
        console.log("success replacing current")
        this.goToCameraView()
      })
      .catch(err => console.error(err))
    }else if (this.state.picPath === this.state.firstTwo[0]){
      AsyncStorage.setItem(Config.firstProgressKey, this.state.firstTwo[1])
      .then(()=> {
        console.log("success replacing first")
        this.goToCameraView();
      })
      .catch(err => console.error(err))
    }else{
      this.goToCameraView();
    }


  }

  loadMeasurements () {
      AsyncStorage.getItem(this.state.key)
      .then(value => {
        if(value !== null) {
          let loadedValue = JSON.parse(value)
          this.setState({
            value: loadedValue
          })
        }
      })
      .catch(error => console.error(error))


    RNFS.readDir(mainPicPath).then(mainResults => {
      let lastTwo = [],
          firstTwo = [];

      let results = mainResults.filter((file) => {
        return file.name.split('.').pop() === 'jpg';
      });


      if(results.length > 1 ) {
        results.slice(-2).map((file)=> {
          lastTwo.push(file.path)
        });
        results.slice(0,2).map((file)=> {
          firstTwo.push(file.path)
        });
        this.setState({
          lastTwo: lastTwo,
          firstTwo: firstTwo,
          isLoading: false,
        })
      }else {

        this.setState({
          lastTwo: [mainPicPath + "/default.jpg",results[0].path],
          firstTwo: [results[0].path,mainPicPath + "/default.jpg"],
          isLoading: false
        })

      }

    })
    .catch(err => console.error(err));



  }

  saveMeasurements () {
    AsyncStorage.setItem(this.state.key, JSON.stringify(this.state.value))
    .then(value => console.log("Success Saving Measurements"))
    .then(this.goToCameraView())
    .catch(err => console.error(err))


  }

  goToCameraView (){
    this.props.navigator.replacePreviousAndPop({
      id: 'HomePage'
    })
  }

  render () {
    if(this.state.isLoading) {
      return (
        <ActivityIndicator
        animating={true}
        style={[styles.centering, {height: 600}]}
        size="large"
      />);
    }else {
      return (
        <ScrollView style = {styles.container}>
          <Image style={styles.image} source={{uri: 'file://'+this.state.picPath}}/>
          <View>
            <Form
              options={options}
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
              <Text style={styles.text}>Save  </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )

    }
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
    backgroundColor: 'red',
  },
  button2: {
    borderColor: '#8E8E8E',
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  text: {
    color: 'white',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .75,
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
  },
   centering: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    padding: 8,
  },
});


export default ImageView;
