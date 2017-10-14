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

var client;

function startRecognition() {

  console.log("Recognition starting...");

  client = new BingSpeech.RecognitionClient("2bfaacabb8314b7bad94b469f1079a81"); // haha totally not a secret thing

  client.onFinalResponseReceived = function (response) {
    console.log("onFinalResponseReceived: " + response);

    // start/stop recording speech
    if (response.includes("Each") || response.includes("Speech") || response.includes("each") || response.includes("speech")) {
      if (response.includes("start")) {
        sendToTab({
          "spType": "start"
        });
      } else if (response.includes("stop")) {
        sendToTab({
          "spType": "stop"
        });
      }
    }

    // click
    var firstWord = response.split(" ")[0];
    console.log("First word: " + firstWord);
    if (firstWord.includes("Click") || firstWord.includes("Quick") ) {
      sendToTab({
        "spType": "click",
        "data": response.substr(response.indexOf(" ") + 1)
      })
    }

    // back
    if (response == "Go back.") {

    }

    // scroll down
    if (response == "Scroll down.") {

    }

    // scroll up
    if (response == "Scroll up.") {

    }
  }

  client.onError = function (code, requestId) {
    // console.log("<Error with request n°" + requestId + ">");
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
  bingClientRecognition.endMicAndContinuousRecognition();
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

startRecognition();
