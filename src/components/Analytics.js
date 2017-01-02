import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  StatusBar,
  Navigator,
  TouchableOpacity,
  ListView,
  ScrollView,
  Switch,
} from 'react-native';


//Icons from ionic
import Icon from 'react-native-vector-icons/Ionicons';

//Styles for the universal toolbar
import toolbarStyle from './Styles';

//File System
const RNFS = require('react-native-fs');


class Analytics extends Component {
  constructor(props) {
    super(props)
  }


  onBackPressed = () => {
    this.props.navigator.replacePreviousAndPop({
      id: 'HomePage'
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
          <Text style={toolbarStyle.toolbarTitle}>Analytics</Text>
        </View>
      </View>
    )
  }

}

export default Analytics;
