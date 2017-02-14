'use strict';
import React, { Component } from 'react';
import {
  Dimensions,
  Alert,
  AsyncStorage,
  TouchableOpacity,
  TouchableHighlight,
  ListView,
  TextInput,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import toolbarStyle from '../components/Styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Communications from 'react-native-communications';

//For forms
const TFORM = require('tcomb-form-native');
const Form = TFORM.form.Form;

const Config = require('../config');

const UUID = require('uuid/v4')

const NumberAmount = TFORM.struct({
  value: TFORM.Number
});

const changeSettingList = Config.settings;

class SubSettings extends Component {
  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    const amount = {
      value: props.data.value
    }

    this.state = {
      dataSource : dataSource.cloneWithRows(props.data.options),
      data: this.props.data,
      amount: amount,
      key: props.data.category+"-"+props.data.item,
      selection: props.data.value

    }

  }


  onBackPressed = () => {
    this.props.navigator.pop({
      id: 'Settings'
    })
  }

  onPressNumber = () => {
    this.saveNumberValue();
  }

  saveNumberValue () {
    let data = this.state.data;
    data.value = this.state.amount.value;
    AsyncStorage.setItem(this.state.key, JSON.stringify(data))
    .then(value => console.log("Success Saving Measurements"))
    .catch(err => console.error(err))

    this.onBackPressed();

  }

  saveSelection (value) {

    let data = this.state.data;
    data.value = value
    AsyncStorage.setItem(this.state.key, JSON.stringify(data))
    .then(value => console.log("Success Saving Measurements"))
    .catch(err => console.error(err))

  }

  onPressSelection = (value) => {

    let data = this.state.data;
    this.setState({
      selection: value,
      dataSource : new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }).cloneWithRows(this.props.data.options)
    });

      switch(value) {
        case "KG":
        case "LB":
          if((value === "KG" && data.value !== "KG") ||
          (value === "LB" && data.value !== "LB")) {
            this.changeWeight(value);
          }
          break;
        case "Inches":
        case "Centimeters":
          if((value === "Inches" && data.value !== "Inches") ||
           (value === "Centimeters" && data.value !== "Centimeters")) {
            this.changeMeasurements(value);
          }
          break;
        default:
          console.log(value);
      }


  }

  changeWeight(value) {
    let settingList = [],
    retrievalKeys = [],
    setList = [];

    changeSettingList.map((setting) => {
      if(setting.item === "Goal Weight"){
        retrievalKeys.push(setting.category+"-"+setting.item);
        settingList.push(setting);
      }
    });

    AsyncStorage.multiGet(retrievalKeys, (err, stores) => {
      stores.map( (result, i, store) => {
        let key = store[i][0];
        let val = store[i][1];
        let pair = [];

        console.log("kg value", val);
        console.log("setting list value at i", settingList[i]);

        if(val!== null) {
          let currentValue = JSON.parse(val);
          if(value === "KG"){
            currentValue.value = (currentValue.value * 0.45).toFixed(2);
            pair.push(key);
            pair.push(JSON.stringify(currentValue));
            setList.push(pair);
          }else{
            currentValue.value = (currentValue.value * 2.204).toFixed(2);
            pair.push(key);
            pair.push(JSON.stringify(currentValue));
            setList.push(pair);
          }
        }else{
          let currentValue = settingList[i];
          pair.push(key);
          pair.push(JSON.stringify(currentValue));
          setList.push(pair);
        }
      })

      console.log("setList", setList);
      AsyncStorage.multiSet(setList, cb => {
        console.log(cb);
      });
    });

    this.saveSelection(value);
  }

  changeMeasurements (value) {

    let settingList = [],
    retrievalKeys = [],
    setList = [];

    changeSettingList.map((setting) => {
      if(setting.type === Config.SettingType.CHANGENUMBER){
        retrievalKeys.push(setting.category+"-"+setting.item);
        settingList.push(setting);
      }
      });

    AsyncStorage.multiGet(retrievalKeys, (err, stores) => {
      stores.map( (result, i, store) => {
        let key = store[i][0];
        let val = JSON.parse(store[i][1]);
        let pair = [];
        console.log("lb value", val);
        console.log("setting list", settingList[i]);

        if(val!== null) {
          if(value === "Inches"){
            val.value = (val.value * 2.54).toFixed(2);
            pair.push(key);
            pair.push(JSON.stringify(val));
            setList.push(pair);
          }else{
            val.value = (val.value / 2.54).toFixed(2);
            pair.push(key);
            pair.push(JSON.stringify(val));
            setList.push(pair);
          }
        }else{
          pair.push(key);
          pair.push(JSON.stringify(settingList[i]));
          setList.push(pair);
        }
      })

      console.log("setList", setList);
      AsyncStorage.multiSet(setList, cb => {
        console.log(cb);
      });
    });

    this.saveSelection(value);
  }

  emailMe = ()=> {
    Communications.email(
      ['pachevjoseph@gmail.com'],
      null,
      null,
      'Progress Pic Tracker Feedback',
      "This is my feedback for your app: "
    );
  }


  renderSeparator (sectionId, rowId) {
    let newRow = rowId + UUID();
    return (
      <View key={newRow} style={styles.separator} />
    )
  }

  renderRow(rowData) {
    let type = this.state.data.type;

    switch (type) {
      case Config.SettingType.NUMBER:
      case Config.SettingType.CHANGENUMBER:
      console.log("it's a asf number");
          return(
              <View style={styles.container}>
                <Form
                  ref="form"
                  type = {NumberAmount}
                  value={this.state.amount}
                  onChange = {(amount) => this.setState({amount: amount})}
                  />
                <TouchableHighlight
                  underlayColor='#ddd'
                  onPress={this.onPressNumber}
                  style={styles.button}>
                  <Text style={styles.buttonText}>
                    Save
                  </Text>
                </TouchableHighlight>
              </View>
          );
        break;
      case Config.SettingType.SELECTION:
      if(rowData  ===  this.state.selection){
        return(
          <TouchableHighlight
            underlayColor='#ddd'
            onPress={()=>this.onPressSelection(rowData)}
            >
            <View style={styles.container}>
              <Text>
                {rowData}
              </Text>
              <View>
                <Icon name='ios-checkmark-circle-outline'
                  style={{textAlign:'center', color:'green'}}
                  size = {20}/>
              </View>
            </View>
          </TouchableHighlight>
        );
      }else{
        return(
          <TouchableHighlight
            underlayColor='#ddd'
            onPress={()=>this.onPressSelection(rowData)}
            >
            <View style={styles.container}>
              <Text>
                {rowData}
              </Text>
            </View>
          </TouchableHighlight>
        );
      }
      break;
    case Config.SettingType.EMAIL:
        return(
          <TouchableHighlight
            underlayColor='#ddd'
            onPress={()=>this.emailMe()}
            >
            <View style={styles.container}>
              <Text>
                {rowData}
              </Text>
            </View>
          </TouchableHighlight>
        );
      break;
      default:
        return(
          <TouchableHighlight
            onPress={()=> Alert.alert("Thank you for using this app")}
            >
            <View style={styles.container}>
              <Text>
                {rowData}
              </Text>
            </View>
          </TouchableHighlight>
        );

      }
    }


  render(){
    return(
    <View>
      <StatusBar animated hidden/>
      <View style={toolbarStyle.toolbar}>
        <TouchableOpacity>
          <Icon name='ios-arrow-back'
            style={toolbarStyle.toolbarButton}
            onPress = {this.onBackPressed}
            size = {25}/>
        </TouchableOpacity>
        <Text style={toolbarStyle.toolbarTitle}>{this.state.data.item}</Text>
      </View>
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        renderSeparator={this.renderSeparator.bind(this)}
        />
    </View>
    )
  }

}


const styles = StyleSheet.create({

  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    width: Dimensions.get('window').width/1.2,
    left: 20,
    backgroundColor: '#8E8E8E',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    width: 80,
    backgroundColor: '#8E8E8E',
    borderColor: '#8E8E8E',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  container: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containern: {
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default SubSettings;
