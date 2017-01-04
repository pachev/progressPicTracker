'use strict'
import {
  StyleSheet,
  Dimensions
 } from 'react-native';

const toolbarStyle = StyleSheet.create({
    toolbar:{
        // backgroundColor:'#81c04d',
        backgroundColor:'#203575',
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
    image: {
      width: Dimensions.get('window').width-10,
      height: 200,
    },
    imageBox: {
      margin: 5,
    },
    headerSection: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      backgroundColor: '#4a505e'
    }
  });

module.exports = toolbarStyle;
