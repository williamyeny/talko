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
  client = new BingSpeech.RecognitionClient("bd8403ca18e599dae6c4d3da9d64812b".split("").reverse().join("")); // haha totally not a secret thing

  client.onFinalResponseReceived = function (response) {
    response = response.toLowerCase();
    console.log("onFinalResponseReceived: " + response);

    // start/stop recording speech
    if (response.includes("taco")) {
      if (response.includes("start") && !spActivated) {
        spActivated = true;
        sendToTab({
          "spType": "start"
        });
        return;
      } else if (response.includes("stop") && spActivated) {
        spActivated = false;
        sendToTab({
          "spType": "stop"
        });
        return;
      }
    }

    if (spActivated) {
      // click
      if (response.split(" ")[0].includes("taco") && !(response.length > 1 ? response.split(" ")[1] : "").includes("stop.")) {
        response = response.replace("taco ", "");
      }
      var firstWord = (response.length > 1 ? response.split(" ")[0] : "");
      var secondWord = (response.length > 1 ? response.split(" ")[1] : "");

      // console.log("First word: " + firstWord);
      if (firstWord.includes("click") || firstWord.includes("quick") || secondWord.includes("click") || secondWord.includes("quick") ) {
        sendToTab({
          "spType": "click",
          "data": response.substr(response.indexOf(" ") + 1)
        })
      }
      if (firstWord.includes("search") || secondWord.includes("search")) {
        sendToTab({
          "spType": "search",
          "data": response.substr(response.indexOf(" ") + 1)
        })
      }

      if (firstWord.includes("play") && secondWord.includes("store")) {
        var playStoreData = response.substr(response.indexOf(" ") + 6);
        if (response.includes("Play store.")) {
          playStoreData = "";
          console.log("empty");
        }
        sendToTab({
          "spType": "play store",
          "data": playStoreData
        })
      }

      // back
      if (response == "go back.") {
        sendToTab({"spType": "go back"});
      }

      // scroll down
      if (response == "scroll down.") {
        sendToTab({"spType": "scroll down"});
      }

      // scroll up
      if (response == "scroll up.") {
        sendToTab({"spType": "scroll up"});
      }

      if (response == "search.") {
        sendToTab({"spType": "search"});  
      }

      //print page
      if (response == "print."){
        sendToTab({"spType":"print"});
      }

      if (response == "full screen."){
        chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, { state: 'fullscreen' } );
      }
      if (response == "minimize."){
        //sendToTab({"spType":"minimize"});
        chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, { state: 'minimized' } );
      }
      if (response == "maximize."){
        //sendToTab({"spType":"maximize"});
        chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, {state: 'maximized' } );
      }
      if (response == "new tab."){
        chrome.tabs.create({});
      }
    /*  if (response == "Reload."){
        chrome.tabs.reload(null,{});
      }
      if (response == "Close tab."){
        sendToTab({"spType":"close"});
      }*/
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
