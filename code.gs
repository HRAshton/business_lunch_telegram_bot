var constants = {
  vk_access_token: "insert_service_token_here______________________6639cc95c25a3b4d26ee1267",
  tlgr_access_token: "insert_token_here____________________________",
  
  vk_public_id: "-9876543",      // prod
  tlgr_chat_id: "-9987654", // prod
}


function triggerLoop() {
  const currentDay = new Date().getDate();
  const lastMessageDate = PropertiesService.getScriptProperties().getProperty("last_message_date");
  if (lastMessageDate == currentDay) return;
  
  const actualPost = getTodaysPostWithMenu();
  if (actualPost == null) return;
  
  deleteLastTlgrMessage();
  
  const images = actualPost.attachments[0].photo.sizes;
  const imageUrl = images.reverse()[0].url;
  const messageId = sendPhotoAndGetMessageId(imageUrl);
  sendPool();
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
  
  const currentDay = new Date().getDate().toString();
  
  for (i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (post.text.indexOf("Меню") == -1 || post.text.indexOf(currentDay) == -1) return;
    
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

function sendPool() {
  const sendPollUrl = "https://api.telegram.org/bot" + constants.tlgr_access_token + "/sendPoll?chat_id=" + constants.tlgr_chat_id + "&options=[%2212:00%22,%2213:00%22,%2215:00%22]&question=%D0%AF%20%D1%81%D0%BE%D0%B1%D0%B8%D1%80%D0%B0%D1%8E%D1%81%D1%8C%20%D0%BF%D0%BE%D0%B9%D1%82%D0%B8%20%D0%BF%D0%BE%D0%BA%D1%83%D1%88%D0%B0%D1%82%D1%8C...%20%D0%9A%D1%82%D0%BE%20%D1%81%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%B8%D1%82%20%D0%BC%D0%BD%D0%B5%20%D0%BA%D0%BE%D0%BC%D0%BF%D0%B0%D0%BD%D0%B8%D1%8E?%20%E2%99%A5&disable_notification=1";
  UrlFetchApp.fetch(sendPollUrl);
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
    "CAADAgAD9AADTptkAihcoMEyHWBsAg"
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
