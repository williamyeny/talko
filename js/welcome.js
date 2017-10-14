navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;

if (navigator.getUserMedia) {
  navigator.getUserMedia({ audio: true }, function(stream) {
  }, function(err) {
  });
} else {
  console.log("getUserMedia not supported");
}