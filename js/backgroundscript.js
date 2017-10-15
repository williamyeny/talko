//https://stackoverflow.com/questions/39310304/chrome-extension-microphone-capture

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason.search(/install/g) === -1) {
        return;
    }
    chrome.tabs.create({
        url: chrome.extension.getURL("welcome.html"),
        active: true
    });
})

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  callback(spActivated);
});

var client;
var spActivated = false;
var listening = false;

function startRecognition() {

  console.log("Recognition starting...");

  client = new BingSpeech.RecognitionClient("5211aa2429decc09b3f4e0e1e9c1c458".split("").reverse().join("")); // haha totally not a secret thing

  client.onFinalResponseReceived = function (response) {
    console.log("onFinalResponseReceived: " + response);

    // start/stop recording speech
    if (response.toLowerCase().includes("taco")) {
      if (response.includes("start") && !spActivated) {
        spActivated = true;
        sendToTab({
          "spType": "start"
        });
      } else if (response.includes("stop") && spActivated) {
        spActivated = false;
        sendToTab({
          "spType": "stop"
        });
      }
    }

    if (spActivated) {
      // click
      var firstWord = response.split(" ")[0];
      var secondWord = (response.length > 1 ? response.split(" ")[1] : "");

      console.log("First word: " + firstWord);
      if (firstWord.includes("Click") || firstWord.includes("Quick") || secondWord.includes("click") || secondWord.includes("quick") ) {
        sendToTab({
          "spType": "click",
          "data": response.substr(response.indexOf(" ") + 1)
        })
      }
      if (firstWord.includes("Search") || secondWord.includes("search")) {
        sendToTab({
          "spType": "search",
          "data": response.substr(response.indexOf(" ") + 1)
        })
      }

      // back
      if (response == "Go back.") {
        sendToTab({"spType": "go back"});
      }

      // scroll down
      if (response == "Scroll down.") {
        sendToTab({"spType": "scroll down"});
      }

      // scroll up
      if (response == "Scroll up.") {
        sendToTab({"spType": "scroll up"});
      }

      if (response == "Search.") {
        sendToTab({"spType": "search"});  
      }

      //print page
      if (response == "Print."){
        sendToTab({"spType":"print"});
      }

      if (response == "Full screen."){
        sendToTab({"spType":"fullscreen"});
      }
      if (response == "Minimize."){
        sendToTab({"spType":"minimize"});
      }
      if (response == "Maximize."){
        sendToTab({"spType":"maximize"});
      }
      if (response == "New tab."){
        sendToTab({"spType":"newtab"});
      }

    }
  }

  client.onError = function (code, requestId) {
    console.log("<Error with request n°" + requestId + ">");
    sendToTab({"spType": "error"});
  }

  client.onVoiceDetected = function () {
    sendToTab({
      "spType": "onVoiceDetected"
    });
  }

  client.onVoiceEnded = function () {
    sendToTab({
      "spType": "onVoiceEnded"
    });
  }

  client.onNetworkActivityStarted = function () {
    sendToTab({
      "spType": "onNetworkActivityStarted"
    });
  }

  client.onNetworkActivityEnded = function () {
    sendToTab({
      "spType": "onNetworkActivityEnded"
    });
  }

  client.startMicAndContinuousRecognition();

}

function stopRecognition() {
  client.endMicAndContinuousRecognition();
}

function sendToTab(data) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs.length != 0) {
      chrome.tabs.sendMessage(tabs[0].id, data);
    } else {
      console.log("No active tab w/ content script running");
    }
    
  });
}

var waitForMicrophone = setInterval(function() {
  navigator.getUserMedia({ audio: true }, (stream) => {
    if (!listening) {
      listening = true;
      clearInterval(waitForMicrophone);
      startRecognition();
    }      
  }, function (e) {
      console.log("Waiting for microphone permission..." + e);
  });
  
},3000);

