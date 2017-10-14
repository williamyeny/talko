console.log("speechpoint activated...");

chrome.runtime.sendMessage({}, function(spActivated) {
  // console.log(response.farewell);
  if (!spActivated) {
    document.body.innerHTML += "<div id=\"sp-status-div\"><p id=\"sp-status\">Not running</p></div>"
  } else {
    document.body.innerHTML += "<div id=\"sp-status-div\"><p id=\"sp-status\">Ready...</p></div>"
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // voice functions
    if(request.spType == "start") {
      console.log("started");
      document.getElementById("sp-status").innerHTML = "Ready";
    } else if(request.spType == "stop") {
      document.getElementById("sp-status").innerHTML = "Not running";
    } else if(request.spType == "onVoiceDetected") {
      console.log("onVoiceDetected");
      document.getElementById("sp-status").innerHTML= "Listening";
    } else if(request.spType == "onVoiceEnded") {
      document.getElementById("sp-status").innerHTML ="Processing";
      console.log("onVoiceEnded");
    } else if (request.spType == "onNetworkActivityStarted") {
      // document.getElementById("sp-status").innerHTML ="Processing";
      console.log("activity start");
    } else if (request.spType == "onNetworkActivityEnded") {
      document.getElementById("sp-status").innerHTML = "Ready";
      console.log("activity ended");
    } else if (request.spType == "click") {
        console.log("click: " + request.data);
        var links = document.getElementsByTagName('a');
        var maxLinkScore = -1;
        var maxLinkIndex = -1;
        for (i = 0; i < links.length; i++) {
          var linkArray = links[i].innerHTML.split(" ");
          var reqArray = request.data.replace(".","").split(" ");
          var linkScore = 0;
          for (j = 0; j < linkArray.length; j++) {
            for (k = 0; k < reqArray.length; k++) {
              if (linkArray[j].toLowerCase() == reqArray[k].toLowerCase()) {
                linkScore++;
              }
            }
          }
          if (linkScore > maxLinkScore) {
            maxLinkIndex = i;
            maxLinkScore = linkScore;
          }
        }
        if (linkScore > maxLinkScore) {
          maxLinkIndex = i;
          maxLinkScore = linkScore;
        }
      if (maxLinkScore > 0) { // if at least one of them has a matching word
        window.location.href = links[maxLinkIndex].getAttribute("href");
      } else {
        console.log("No link matches!");
      }
  }
    else if (request.spType == "go back") {
      goBackToPreviousPage();
    } else if (request.spType == "scroll down") {

    } else if (request.spType == "scroll up") {
  }

});


function goBackToPreviousPage(){
    window.history.back();
}

setTimeout(function () {
    console.log("start scrolling : " + screen.height/2);
    console.log((new Date()).getTime());
    window.scrollTo(0, screen.height/2);
    console.log((new Date()).getTime());
}, 1000);
