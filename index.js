const core = require('@actions/core');
const fs = require('fs');
const _ = require('lodash');

function arrayToMap(arr, key) {
  return new Map(arr.map((obj) => [obj[key], obj]));
}

try {
  const newJsonFilePath = core.getInput('new_json_file');
  const oldJsonFilePath = core.getInput('old_json_file');
  const newJson = JSON.parse(fs.readFileSync(newJsonFilePath, {encoding:'utf8'}));
  const oldJson = JSON.parse(fs.readFileSync(oldJsonFilePath, {encoding:'utf8'}));

  const oldJsonById = arrayToMap(oldJson.concept, 'id');
  const newJsonById = arrayToMap(newJson.concept, 'id');

  const oldIds = new Set(oldJsonById.keys());
  const newIds = new Set(newJsonById.keys());
  
  const nameProperties = ['prefLabel', 'broader'];

  const added = [...newIds].filter(key => !oldIds.has(key)).map(id => newJsonById.get(id).prefLabel);
  const removed = [...oldIds].filter(key => !newIds.has(key)).map(id => oldJsonById.get(id).prefLabel);
  const renamed = [...oldIds].filter(key => newIds.has(key) && oldJsonById.get(key).prefLabel !== newJsonById.get(key).prefLabel).map(id => [oldJsonById.get(id).prefLabel, newJsonById.get(id).prefLabel]);
  const moved = [...oldIds].filter(key => newIds.has(key) && !_.isEqual(oldJsonById.get(key).broader, newJsonById.get(key).broader)).map(id => newJsonById.get(id).prefLabel);
  const updated = [...oldIds].filter(key => newIds.has(key) && !_.isEqual(_.omit(oldJsonById.get(key), nameProperties), _.omit(newJsonById.get(key), nameProperties))).map(id => newJsonById.get(id).prefLabel);
  
  let humanReadableString = '';

  if (added.length) humanReadableString += `- Added: ${added.join(', ')}\n`;
  if (removed.length) humanReadableString += `- Removed: ${removed.join(', ')}\n`;
  if (renamed.length) humanReadableString += `- Renamed: ${renamed.map(([oldName, newName]) => `${oldName} -> ${newName}`).join(', ')}\n`;
  if (moved.length) humanReadableString += `- Moved: ${moved.join(', ')}\n`;
  if (updated.length) humanReadableString += `- Updated: ${updated.join(', ')}\n`;

  if (humanReadableString) {
    console.log(`Found changes:\n\n${humanReadableString}`);
    core.setOutput("hasChanged", true);
    core.setOutput("changeDescription", humanReadableString);
  } else {
    console.log(`No changes to the activity list were found`);
    core.setOutput("hasChanged", false);
  }
} catch (error) {
  core.setFailed(error.message);
}