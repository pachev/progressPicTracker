'use strict'

const RNFS = require('react-native-fs');


const settings = [
    {item: "Weight", category: "Units", value: null},
    {item: "Height", category: "Units", value: null},
    {item: "Goal Weight", category: "Goals", value: null},
    {item: "Goal Waist", category: "Goals", value: null},
    {item: "Goal Bicep", category: "Goals", value: null},
    {item: "Height", category: "Settings", value: null},
    {item: "Gender & Age", category: "Settings", value: null},
    {item: "Passcode", category: "Settings", value: null},
    {item: "Backup", category: "Data", value: null},
    {item: "Reset", category: "Data", value: null},
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
