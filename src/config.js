'use strict'

const RNFS = require('react-native-fs');

const SettingType = {
  SELECTION: 0,
  NUMBER: 1,
  EMAIL: 2,
  SWITCH: 3,
  DISPLAY: 4,
  RATE: 5,
}

const settings = [
{item: "Weight", category: "UNITS",
   value: "LB", options: ["LB", "KG"], selected: 0, type: SettingType.SELECTION},
{item: "Height", category: "UNITS",
  value: "Inches", options: ["Inches", "Centimeters"], selected: 0, type: SettingType.SELECTION},
{item: "Goal Weight", category: "GOALS",
   value: 0, options: ["amount"], type: SettingType.NUMBER},
{item: "Goal Waist", category: "GOALS",
  value: 0, options: ["amount"], type: SettingType.NUMBER},
{item: "Goal Bicep", category: "GOALS",
  value: 0, options: ["amount"], type: SettingType.NUMBER},
{item: "Height", category: "SETTINGS",
  value: 0, options: ["amount"], type: SettingType.NUMBER},
{item: "Gender", category: "SETTINGS",
  value: "Male", options: ["Male", "Female"], type: SettingType.SELECTION},
{item: "Age", category: "SETTINGS",
  value: 0, options: ["amount"], type: SettingType.NUMBER},
  //For later implementation
// {item: "Passcode", category: "SETTINGS",
//   value: null, options: [], type: SettingType.SWITCH},
// {item: "Backup", category: "DATA",
//   value: null, options: ["Email data", "Google Drive"], type: SettingType.BUTTON},
// {item: "Reset", category: "DATA",
//   value: null, options: ["Reset All"], type: SettingType.BUTTON},
{item: "Send Feedback", category: "ABOUT",
  value: null, options: ["Email Me"], type: SettingType.EMAIL},
{item: "Rate", category: "ABOUT",
  value: null, options: ["Rate this app"], type: SettingType.RATE},
{item: "Version", category: "ABOUT",
  value: null, options: ["0.0.1"], type: SettingType.DISPLAY},
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
  'convertArrayToMap': convertArrayToMap,
  'SettingType': SettingType

}
