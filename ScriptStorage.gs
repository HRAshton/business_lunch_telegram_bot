function ScriptStorage() {
  return {
    Save: _saveToStorage,
    Get: _getFromStorage,
  }
}


function _saveToStorage(variableName, data) {
  const stringData = JSON.stringify(data);
  PropertiesService.getScriptProperties().setProperty(variableName, stringData);
}

function _getFromStorage(variableName) {
  const savedData = PropertiesService.getScriptProperties().getProperty(variableName);
  const originalData = JSON.parse(savedData);
  
  return originalData;
}
