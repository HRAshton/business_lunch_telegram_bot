function UrlHelper() {
  return {
    SendCommonRequest: SendCommonRequest,
    SendTelegramApiRequest: SendTelegramApiRequest,
    SendVkApiRequest: SendVkApiRequest,
  }
}


function SendCommonRequest(url, queryDataDict) {
  const queryString = CreateQueryString(queryDataDict);
  const fullUrl = url + "?" + queryString;
  const textResponse = UrlFetchApp.fetch(fullUrl).getContentText();
  
  return textResponse;
}

function SendTelegramApiRequest(token, apiMethod, queryDataDict) {
  const url = "https://api.telegram.org/bot" + token + "/" + apiMethod;
  const response = SendCommonRequest(url, queryDataDict);
  const responseModel = JSON.parse(response);
  
  return responseModel;
}

function SendVkApiRequest(token, apiMethod, queryDataDict) {
  queryDataDict.access_token = token;
  queryDataDict.v = "5.101";
  
  const url = "https://api.vk.com/method/" + apiMethod;
  const response = SendCommonRequest(url, queryDataDict);
  const responseModel = JSON.parse(response);
  
  return responseModel;
}


function CreateQueryString(queryDataDict) {
  var str = [];
  
  for (var p in queryDataDict) {
    if (queryDataDict.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(queryDataDict[p]));
    }
  }
  
  var result = str.join("&");
  
  return result;
}
