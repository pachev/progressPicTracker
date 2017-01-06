'use strict'

const RNFS = require('react-native-fs');


let options = {
      width: 300,
      height: 300,
      color: '#2980B9',
      margin: {
        top: 20,
        left: 45,
        bottom: 25,
        right: 20
      },
      axisX: {
        showAxis: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'bottom',
        label: {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: true,
          fill: '#34495E'
        }
      },
      axisY: {
        showAxis: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'left',
        label: {
          fontFamily: 'Arial',
          fontSize: 14,
          fontWeight: true,
          fill: '#34495E'
        }
      }
    }

module.exports = {
  'picPath': RNFS.DocumentDirectoryPath +'/progressPicTracker/pics',
  'graphPath': RNFS.DocumentDirectoryPath +'/progressPicTracker/graphs',
  'chartOptions': options
}
