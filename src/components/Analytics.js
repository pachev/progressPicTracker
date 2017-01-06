import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  Dimensions,
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
const Config = require('../config');



class Analytics extends Component {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: dataSource,
      data: {}

    }
  }

  componentDidMount() {
    this.fetchData();

  }

  fetchData () {
    const data = ["Weight", "Waist", "Hip", "Bicep", "All"];
    let measurements = this.props.measurements;
    let stateData = {};

    for (i in measurements) {

      console.log(measurements[i].weight);
    }
    this.setState ({
      dataSource: this.state.dataSource.cloneWithRows(data)
    })

  }


  onBackPressed = () => {
    this.props.navigator.replacePreviousAndPop({
      id: 'HomePage'
    })
  }

  renderRow (rowData) {
    return (
      <TouchableOpacity
        onPress={()=> console.log("{rowData} was pressed")}
        >
        <View style={styles.container2}>
          <Text style={styles.text}>
            {rowData}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={{flex: 1}}>
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
        <View style={styles.chart}>
        </View>
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow= {this.renderRow.bind(this)}
          renderSeparator={(sectionId, rowId) => <View key= {rowId} style={styles.separator}/>}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },
    container2: {
      flex: 1,
      padding: 12,
      flexDirection: 'row',
    },
    text: {
      fontSize: 17,
      textAlign: 'center',
      marginLeft:  Dimensions.get('window').width/2.7,
      fontWeight: 'bold',
    },
    chart: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2.2,
        backgroundColor: "rgb(249, 251, 255)",
        padding: 20
    },
    separator: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#8E8E8E',
    },
})

export default Analytics;
