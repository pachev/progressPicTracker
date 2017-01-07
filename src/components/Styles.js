'use strict'
import {
  StyleSheet,
  Dimensions
 } from 'react-native';

//refractor and export multiple styles
const toolbarStyle = StyleSheet.create({
    toolbar:{
        // backgroundColor:'#81c04d',
        backgroundColor:'#78909C',
        paddingTop:20,
        paddingBottom:10,
        flexDirection:'row'
    },
    toolbarButton:{
        width: 40,
        color:'#fff',
        textAlign:'center'
    },
    toolbarTitle:{
        color:'#fff',
        textAlign:'center',
        fontWeight:'bold',
        flex:1
    },
  });

module.exports = toolbarStyle;
