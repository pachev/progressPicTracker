import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  Navigator,
  TouchableOpacity,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';

const RNFS = require('react-native-fs');

class Settings extends Component {

  constructor(props) {
    super(props)
  }
  render () {
    return (
      <View>
      <Text>
      Hello World
      </Text>
      </View>
    )
  }

}

export default Settings;
