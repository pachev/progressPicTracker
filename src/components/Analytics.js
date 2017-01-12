import React, {Component} from 'react';
import {
  AppRegistry,
  Text,
  Alert,
  View,
  ActivityIndicator,
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

import Graph from 'react-native-line-plot';

const data = ["Weight", "Waist", "Hip", "Bicep"];

class Analytics extends Component {
  constructor(props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      dataSource: dataSource.cloneWithRows(data),
      measurements: props.measurements,
      data: [],
      yUnit: 'weight',
      isLoading: true,

    }
  }

  componentDidMount() {
    this.fetchData('weight');

  }

  fetchData (value) {
    this.setState({
      isLoading: true
    });

    let measurements = this.state.measurements,
        stateData =[],
        sameItemCheck =[],
        date,
        attribute,
        pair = [];

    for (i in measurements) {
      pair = [];
      date = new Date(measurements[i].dateTaken);

      //TODO: find a more efficent way of doing this
      switch (value.toLowerCase()) {
        case 'bicep':
          attribute = measurements[i].biceps;
          console.log("bicep", attribute);
          break;
        case 'hip':
          attribute = measurements[i].hip;
          console.log("hip", attribute);
          break;
        case 'waist':
          attribute = measurements[i].waist;
          console.log("waist", attribute);
          break;
        default:
          attribute = measurements[i].weight;
          console.log("weight", attribute);
      }

      pair.push(date.getTime());
      pair.push(attribute);
      sameItemCheck.push(attribute)

      stateData.push(pair)
    }
    if(this.validateData(sameItemCheck)){
      Alert.alert("Insufficient Data", "Insuficient data to render this graph");
    }else{
      this.setState ({
        data: stateData,
        yUnit: value,
        isLoading: false
      });

    }

  }

  validateData(array) {
    const first = array[0];

    return array.every(function(element) {
      return element === first;
    });
  }


  onBackPressed = () => {
    this.props.navigator.pop({
      id: 'HomePage'
    })
  }

  renderRow (rowData) {
    return (
      <TouchableOpacity
        onPress={()=> this.fetchData(rowData)}
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
    if(this.state.isLoading){

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
        <ActivityIndicator
          animating={true}
          style={[styles.centering, {height: 80}]}
          size="large"
          />
        </View>
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderRow= {this.renderRow.bind(this)}
          renderSeparator={(sectionId, rowId) => <View key= {rowId} style={styles.separator}/>}
          />
      </View>
    )
    }else {

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
            <Graph
              data={this.state.data}
              graphColorPrimary='#000000'
              graphWidth={Dimensions.get('window').width/1.3}
              graphHeight={Dimensions.get('window').height/2.5}
              graphColorSecondary='black'
              graphWidthSecondary='2'
              graphWidthPrimary='2'
              xUnit='date'
              yUnit={this.state.yUnit}
              yAxisDensity= {5}
              />
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
        padding: 20
    },
    separator: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#8E8E8E',
    },
})

export default Analytics;
