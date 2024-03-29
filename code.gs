function triggerLoop() {
  const weekday = new Date().getDay();
  if (weekday == 0 || weekday == 6) return;
  
  const currentDay = new Date().getDate();
  const lastMessageDate = ScriptStorage().Get("last_message_date");
  if (lastMessageDate == currentDay) return;
  
  const actualPost = getTodaysPostWithMenu();
  if (actualPost == null) return;
  
  deleteLastTlgrMessage();
  
  const images = actualPost.attachments[0].photo.sizes;
  const imageUrl = images.reverse()[0].url;
  const messageId = sendPhotoAndGetMessageId(imageUrl);
  sendRandomSticker();
  
  ScriptStorage().Save("last_tlgr_sent_message_id", messageId);
  ScriptStorage().Save("last_message_date", currentDay);
}



function getTodaysPostWithMenu() {  
  const serverResponse = UrlHelper().SendVkApiRequest(constants.vk_access_token, "wall.get", {owner_id: constants.vk_public_id, count: 5});
  const posts = serverResponse.response.items;
  
  const todayDateNumber = new Date().toISOString().substr(8, 2);
  
  for (i = 0; i < posts.length; i++) {
    const post = posts[i];
        
    if (post.attachments.length != 1 || post.text.indexOf(todayDateNumber) == -1)
        return;
    
    return post;
  }
  
  return null;
}



function sendPhotoAndGetMessageId(photoUrl) {
  const serverResponse = UrlHelper().SendTelegramApiRequest(constants.tlgr_access_token, "sendPhoto", {chat_id: constants.tlgr_chat_id, photo: photoUrl});
  const messageId = serverResponse.result.message_id;
  
  return messageId;
}

function sendRandomSticker() {
  const stickerIds = [
    "CAADAgADUwIAAvI_3A6glyDi5yAF7QI",
    "CAADAgADxQIAAvI_3A6WNQ1aWSkM_gI",
    "CAADAgAD2QADwVcuCAABU4HLjN6s_QI", 
    "CAADAgADAQEAAuZnjhEadSOv752T8QI",
    "CAADAgADEQUAAujW4hJAQyHFVq7p3gI",
    "CAADAgADlwADIIAaIhOSoYn7H8VvAg",
    "CAADAgADBgADu96RFuc4AjHF6XICAg",
    "CAADAgAD9AADTptkAihcoMEyHWBsAg",
    
    "CAADAgAD2wADTbVREYKoXlY7KqM1Ag",
    "CAADAgADywADTbVREf4fFLJox25eAg",
    "CAADAgADxwADTbVREWQoIsRelkPmAg",
    "CAADBAADbz0AAnrRWwa3QZlRNgTvPwI",
    "CAADAgADSAADaUCAC4sgFGJH1ufVAg",
    "CAADAgADzC8AAmOLRgya4UWbCuqurAI",
    "CAADAgADdCEAAmOLRgyY85zpuGMocQI"
  ];
  
  var stickersQueue = ScriptStorage().Get("stickers_queue") || [];
  if (stickersQueue.length === 0) {
    stickersQueue = CommonHelpers().ShuffleArray(stickerIds);
  }
  const stickerId = stickersQueue.pop();
  ScriptStorage().Save("stickers_queue", stickersQueue);
  
  UrlHelper().SendTelegramApiRequest(constants.tlgr_access_token, "sendSticker", {chat_id: constants.tlgr_chat_id, sticker: stickerId, disable_notification: 1});
}



function deleteLastTlgrMessage() {
  const lastTlgrSentMessageId = PropertiesService.getScriptProperties().getProperty("last_tlgr_sent_message_id");
  if (!lastTlgrSentMessageId) return;
  
  try {
    UrlHelper().SendTelegramApiRequest(constants.tlgr_access_token, "deleteMessage", {chat_id: constants.tlgr_chat_id, message_id: lastTlgrSentMessageId});
  } catch (ex) {
    Logger.log(ex);
  }
}
