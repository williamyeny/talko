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
        goBackToPreviousPage();
    } else if (request.spType == "scroll down") {

    } else if (request.spType == "scroll up") {

    }
  }
});

function goBackToPreviousPage(){
    window.history.back();
}

function scrollYDistance(targetY, duration, onDone) {
			stopScroll()
			if (duration === 0 || (duration && duration < 0) || isNativeSmoothScrollEnabledOn(container.body)) {
				container.toY(targetY)
				if (onDone) {
					onDone()
				}
			} else {
				var startY = container.getY()
				var distance = Math.max(0, targetY) - startY
				var startTime = new Date().getTime()
				duration = duration || Math.min(Math.abs(distance), defaultDuration);
				(function loopScroll() {
					setScrollTimeoutId(setTimeout(function () {
						// Calculate percentage:
						var p = Math.min(1, (new Date().getTime() - startTime) / duration)
						// Calculate the absolute vertical position:
						var y = Math.max(0, Math.floor(startY + distance*(p < 0.5 ? 2*p*p : p*(4 - p*2)-1)))
						container.toY(y)
						if (p < 1 && (container.getHeight() + y) < container.body.scrollHeight) {
							loopScroll()
						} else {
							setTimeout(stopScroll, 99) // with cooldown time
							if (onDone) {
								onDone()
							}
						}
					}, 9))
				})()
			}
		}
setTimeout(function () {
    scroll;
}, 5000);
