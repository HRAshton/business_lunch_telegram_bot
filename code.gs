var constants = {
  vk_access_token: "insert_service_token_here______________________6639cc95c25a3b4d26ee1267",
  tlgr_access_token: "insert_token_here____________________________",
  
  vk_public_id: "-9876543",      // prod
  tlgr_chat_id: "-9987654", // prod
}


function triggerLoop() {
  const weekday = new Date().getDay();
  if (weekday == 0 || weekday == 6) return;
  
  const currentDay = new Date().getDate();
  const lastMessageDate = PropertiesService.getScriptProperties().getProperty("last_message_date");
  if (lastMessageDate == currentDay) return;
  
  const actualPost = getTodaysPostWithMenu();
  if (actualPost == null) return;
  
  deleteLastTlgrMessage();
  
  const images = actualPost.attachments[0].photo.sizes;
  const imageUrl = images.reverse()[0].url;
  const messageId = sendPhotoAndGetMessageId(imageUrl);
  sendRandomSticker();
  
  PropertiesService.getScriptProperties().setProperty("last_tlgr_sent_message_id", messageId);
  PropertiesService.getScriptProperties().setProperty("last_message_date", currentDay);
}



function getTodaysPostWithMenu() {
  const url = "https://api.vk.com/method/wall.get?owner_id=" + constants.vk_public_id + 
    "&access_token=" + constants.vk_access_token + 
    "&count=5" +
    "&v=5.101";
  const response = UrlFetchApp.fetch(url);
  const posts = JSON.parse(response.getContentText()).response.items;
  
  const currentDate = new Date();
  
  for (i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postDate = new Date(post.date * 1000);
    
    if (post.attachments.length != 1 || postDate.toDateString() != currentDate.toDateString()) 
        return;
    
    return post;
  }
  
  return null;
}



function sendPhotoAndGetMessageId(photoUrl) {
  const sendPhotoUrl = "https://api.telegram.org/bot" + constants.tlgr_access_token + "/sendPhoto?chat_id=" + constants.tlgr_chat_id + 
    "&photo=" + photoUrl;
  const telegramResponse = UrlFetchApp.fetch(sendPhotoUrl).getContentText();
  const model = JSON.parse(telegramResponse);
  const messageId = model.result.message_id;
  
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
  
  const stickerId = stickerIds[Math.floor(Math.random() * stickerIds.length)];
  const sendPollUrl = "https://api.telegram.org/bot" + constants.tlgr_access_token + "/sendSticker?chat_id=" + constants.tlgr_chat_id + "&sticker=" + stickerId + "&disable_notification=1";
  UrlFetchApp.fetch(sendPollUrl);  
}



function deleteLastTlgrMessage() {
  const lastTlgrSentMessageId = PropertiesService.getScriptProperties().getProperty("last_tlgr_sent_message_id");
  if (!lastTlgrSentMessageId) return;
  
  const deleteMessageUrl = "https://api.telegram.org/bot" + constants.tlgr_access_token + "/deleteMessage?" +
    "chat_id=" + constants.tlgr_chat_id + 
    "&message_id=" + lastTlgrSentMessageId;
  
  try {
    UrlFetchApp.fetch(deleteMessageUrl);
  } catch (ex) {
    Logger.log(ex)
  }
}
