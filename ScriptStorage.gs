function ScriptStorage() {
  return {
    Save: SaveToStorage,
    Get: GetFromStorage,
  }
}


function SaveToStorage(variableName, data) {
  PropertiesService.getScriptProperties().setProperty(variableName, data);
}

function GetFromStorage(variableName) {
  const savedData = PropertiesService.getScriptProperties().getProperty(variableName);
  
  return savedData;
}
