//https://stackoverflow.com/questions/39310304/chrome-extension-microphone-capture

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason.search(/install/g) === -1) {
        return
    }
    chrome.tabs.create({
        url: chrome.extension.getURL("welcome.html"),
        active: true
    })
})

var bingClientRecognition = new BingSpeech.RecognitionClient("2bfaacabb8314b7bad94b469f1079a81"); // haha totally not a secret thing

bingClientRecognition.startMicAndContinuousRecognition();

bingClientRecognition.endMicAndContinuousRecognition();