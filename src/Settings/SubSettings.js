'use strict';
import React, { Component } from 'react';
import {
  Dimensions,
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

//For forms
const TFORM = require('tcomb-form-native');
const Form = TFORM.form.Form;

const Config = require('../config');

const UUID = require('uuid/v4')

const NumberAmount = TFORM.struct({
  value: TFORM.Number
});

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
      key: "settings-"+props.data.item

    }

  }


  onBackPressed = () => {
    this.props.navigator.pop({
      id: 'Settings'
    })
  }

  onPressNumber = () => {
    console.log(this.state.value);
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
          return(
              <View style={styles.containern}>
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
      default:
        return(
          <TouchableHighlight>
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
