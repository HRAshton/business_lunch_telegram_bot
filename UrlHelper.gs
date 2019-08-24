function UrlHelper() {
  return {
    SendCommonRequest: _sendCommonRequest,
    SendTelegramApiRequest: _sendTelegramApiRequest,
    SendVkApiRequest: _sendVkApiRequest,
  }
}


function _sendCommonRequest(url, queryDataDict) {
  const queryString = _createQueryString(queryDataDict);
  const fullUrl = url + "?" + queryString;
  const textResponse = UrlFetchApp.fetch(fullUrl).getContentText();
  
  return textResponse;
}

function _sendTelegramApiRequest(token, apiMethod, queryDataDict) {
  const url = "https://api.telegram.org/bot" + token + "/" + apiMethod;
  const response = _sendCommonRequest(url, queryDataDict);
  const responseModel = JSON.parse(response);
  
  return responseModel;
}

function _sendVkApiRequest(token, apiMethod, queryDataDict) {
  queryDataDict.access_token = token;
  queryDataDict.v = "5.101";
  
  const url = "https://api.vk.com/method/" + apiMethod;
  const response = _sendCommonRequest(url, queryDataDict);
  const responseModel = JSON.parse(response);
  
  return responseModel;
}


function _createQueryString(queryDataDict) {
  var str = [];
  
  for (var p in queryDataDict) {
    if (queryDataDict.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(queryDataDict[p]));
    }
  }
  
  var result = str.join("&");
  
  return result;
}
