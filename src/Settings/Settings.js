import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StatusBar,
  Navigator,
  TouchableOpacity,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';

//Styles for the universal toolbar
import toolbarStyle from '../components/Styles';

const RNFS = require('react-native-fs');

class Settings extends Component {
  constructor(props) {
    super(props)
  }


  onBackPressed = () => {
    this.props.navigator.pop({
      id: 'CameraView'
    })
  }

  render() {
    return (
      <View>
        <StatusBar animated hidden/>
        <View style={toolbarStyle.toolbar}>
          <TouchableOpacity>
          <Icon name='ios-arrow-back'
                style={toolbarStyle.toolbarButton}
                onPress = {this.onBackPressed}
                size = {25}/>
          </TouchableOpacity>
          <Text style={toolbarStyle.toolbarTitle}>Settings</Text>
        </View>
      </View>
    )
  }

}

export default Settings;
