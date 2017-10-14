console.log("speechpoint activated...");
var spActivated = false;
var spStatus;
document.body.innerHTML += "<div id=\"sp-status-div\"><p id=\"sp-status\">Not running</p></div>"

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  // voice functions
  if(request.spType == "start" && !spActivated) {
    console.log("started");
    spActivated = true;
    document.getElementById("sp-status").innerHTML = "Ready...";
    // spStatus = 
  } else if(request.spType == "stop" && spActivated) {
    document.getElementById("sp-status").innerHTML = "Not running...";
    spActivated = false;
  } else if(request.spType == "onVoiceDetected") {
    console.log("onVoiceDetected");
    document.getElementById("sp-status").innerHTML= "Listening...";
  } else if(request.spType == "onVoiceEnded") {
    document.getElementById("sp-status").innerHTML ="Processing...";
    console.log("onVoiceEnded");
  } else if (request.spType == "onNetworkActivityStarted") {
    document.getElementById("sp-status").innerHTML ="Processing...";
  } else if (request.spType == "onNetworkActivityEnded") {
    document.getElementById("sp-status").innerHTML = "Done!";
  } else if (spActivated) {
    if (request.spType == "click") {
      console.log("click: " + request.data);
    } else if (request.spType == "go back") {
        goBackToPreviousPage();
    } else if (request.spType == "scroll down") {

    } else if (request.spType == "scroll up") {

    }
  }
});

function goBackToPreviousPage(){
    window.history.back();
}
