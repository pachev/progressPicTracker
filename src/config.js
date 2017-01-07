'use strict'

const RNFS = require('react-native-fs');


const settings = [
    {item: "Weight", category: "UNITS", value: null},
    {item: "Height", category: "UNITS", value: null},
    {item: "Goal Weight", category: "GOALS", value: null},
    {item: "Goal Waist", category: "GOALS", value: null},
    {item: "Goal Bicep", category: "GOALS", value: null},
    {item: "Height", category: "SETTINGS", value: null},
    {item: "Gender & Age", category: "SETTINGS", value: null},
    {item: "Passcode", category: "SETTINGS", value: null},
    {item: "Backup", category: "DATA", value: null},
    {item: "Reset", category: "DATA", value: null},
    {item: "Send Feedback", category: "ABOUT", value: null},
    {item: "Rate", category: "ABOUT", value: null},
    {item: "Version", category: "ABOUT", value: null},
];

let convertArrayToMap = (list)=> {

  var CategoryMap = {}; // Create the blank map
  list.forEach((item) => {
    if (!CategoryMap[item.category]) {
      // Create an entry in the map for the category if it hasn't yet been created
      CategoryMap[item.category] = []
    }
    
    CategoryMap[item.category].push(item);
     
  });
  
  return CategoryMap;
  
}

module.exports = {
  'picPath': RNFS.DocumentDirectoryPath +'/progressPicTracker/pics',
  'graphPath': RNFS.DocumentDirectoryPath +'/progressPicTracker/graphs',
  'settings': settings,
  'convertArrayToMap': convertArrayToMap

}
