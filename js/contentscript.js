console.log("Talko running (not activated)...");

chrome.runtime.sendMessage({}, function(spActivated) {
  // console.log(response.farewell);
  var div = document.createElement("div");
  div.innerHTML += "<div id=\"sp-status-div\" class=\"animated slideInRight\"><p id=\"sp-status\">Not running...</p></div>";
  document.body.appendChild(div);
  if (!spActivated) {
    spStop();
  } else {
    spStart();
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    // voice functions
    if(request.spType == "start") {
      console.log("Service enabled!");
      spStart();
    } else if(request.spType == "stop" || request.spType == "shop") {
      console.log("Service stopped.");
      spStop();
    } else if(request.spType == "onVoiceDetected") {
      console.log("onVoiceDetected");
      document.getElementById("sp-status").innerHTML= "Listening";
    } else if(request.spType == "onVoiceEnded") {
      document.getElementById("sp-status").innerHTML = "Ready";
      console.log("onVoiceEnded");
    } else if (request.spType == "onNetworkActivityStarted") {
      document.getElementById("sp-status").innerHTML ="Processing";
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
        links[maxLinkIndex].style.color = "black";
        links[maxLinkIndex].className += " animated pulse";
        links[maxLinkIndex].style["background-color"] = "#ffff00";
        links[maxLinkIndex].style["border-color"] = "#ffff00";
        setTimeout(function() {
          links[maxLinkIndex].click();
        }, 2000);
        
      } else {
        console.log("No link matches!");
      }
    } else if (request.spType == "go back") {
      goBackToPreviousPage();
    } else if (request.spType == "scroll down") {
      scrollDown();
    } else if (request.spType == "scroll up") {
      scrollUp();
    } else if (request.spType == "search"){
      console.log("search: " + request.data);
      window.open("http://bing.com/search?q=" + request.data);
    }
    else if (request.spType == ("newtab")) {
       window.open();
    } 
   /* else if (request.spType==("close")){
      window.close();
    }*/
    else if (request.spType == "print"){
      printPage();
    }
    else if (request.spType == "error") {
      document.getElementById("sp-status").innerHTML= "Try again :(";
    } else if (request.spType == "play store") {
      if (request.data != "") {
        window.open("https://play.google.com/store/search?q=" + request.data + "&c=apps");
      } else {
        window.open("https://play.google.com/store/search?q=dice%20jobs&c=apps");
      }
      
    }

  });
});

function scrollDown() {
  var scrollDistance = 15.0;
  var smoothScroll = setInterval(function() {
    window.scrollBy(0, scrollDistance);
    scrollDistance *= 0.96;

    if (scrollDistance <= 1) {
      clearInterval(smoothScroll);
    }
  },10);
}

function scrollUp() {
  var scrollDistance = 15.0;
  var smoothScroll = setInterval(function() {
    window.scrollBy(0, -scrollDistance);
    scrollDistance *= 0.96;

    if (scrollDistance <= 1) {
      clearInterval(smoothScroll);
    }
  },10);
}

function spStart() {
  document.getElementById("sp-status-div").style.background = "linear-gradient(141deg, rgb(68, 64, 60), rgb(47, 49, 49))";
  document.getElementById("sp-status").innerHTML = "Ready";
  document.getElementById("sp-status-div").style.opacity = 1;
  document.getElementById("sp-status-div").className = "animated bounce";
}

function spStop() {
  document.getElementById("sp-status-div").style.background = "#6b6661";
  document.getElementById("sp-status-div").style.opacity = 0.5;
  document.getElementById("sp-status").innerHTML = "Not running";
}

function goBackToPreviousPage(){
    window.history.back();
}

function printPage(){
  window.print();
}

// function scrollDown(percentageOfPage){
//     window.scrollTo(0, window.pageYOffset + screen.height*percentOfPage);;
// }

// function scrollUp(percentageOfPage){
//     window.scrollTo(0, window.pageYOffset - screen.height*percentOfPage);;
// }
