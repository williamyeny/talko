console.log("speechpoint activated...");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.spType == "start") {
    console.log("started");
  } else if(request.spType == "stop") {
    console.log("stopped");
  } else if(request.spType == "onVoiceDetected") {
    console.log("onVoiceDetected");
  } else if(request.spType == "onVoiceEnded") {
    console.log("onVoiceEnded");
  }
  
});