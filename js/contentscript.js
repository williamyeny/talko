console.log("speechpoint activated...");
var spActivated = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  // voice functions
  if(request.spType == "start") {
    console.log("started");
    spActivated = true;
  } else if(request.spType == "stop") {
    console.log("stopped");
    spActivated = false;
  } else if(request.spType == "onVoiceDetected") {
    console.log("onVoiceDetected");
  } else if(request.spType == "onVoiceEnded") {
    console.log("onVoiceEnded");
  } else if (request.spType == "onNetworkActivityStarted") {

  } else if (request.spType == "onNetworkActivityEnded") {

  } else if (spActivated) {
    if (request.spType == "click") {
      console.log("click: " + request.data);
    } else if (request.spType == "go back") {

    } else if (request.spType == "scroll down") {

    } else if (request.spType == "scroll up") {

    }
  }
});