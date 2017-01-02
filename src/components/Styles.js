'use strict'
import { StyleSheet } from 'react-native';

const toolbarStyle = StyleSheet.create({
    toolbar:{
        // backgroundColor:'#81c04d',
        backgroundColor:'#7D7D7D',
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
      width: 400,
      height: 200,
  }
});

module.exports = toolbarStyle;
