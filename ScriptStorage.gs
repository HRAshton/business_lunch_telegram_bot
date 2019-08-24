function ScriptStorage() {
  return {
    Save: SaveToStorage,
    Get: GetFromStorage,
  }
}


function SaveToStorage(variableName, data) {
  const stringData = JSON.stringify(data);
  PropertiesService.getScriptProperties().setProperty(variableName, stringData);
}

function GetFromStorage(variableName) {
  const savedData = PropertiesService.getScriptProperties().getProperty(variableName);
  const originalData = JSON.parse(savedData);
  
  return originalData;
}
