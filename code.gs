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
