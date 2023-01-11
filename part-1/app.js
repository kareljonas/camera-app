// Set constraints for the video stream
var constraints = { video: { facingMode: "environment" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    //console.log(cameraSensor.toDataURL())
    cameraOutput.src = cameraSensor.toDataURL("image/webp"); //"image/webp"
    cameraOutput.classList.add("taken");
    var blob = dataURItoBlob(cameraOutput.src);
    console.log('kj after onclick'+blob);
    // track.stop();
    //Then just append the blob to a new FormData object and post it to your server using ajax:
    var fd = new FormData(document.forms[0]);
    var xhr = new XMLHttpRequest();
    fd.append("KJmyFile", blob);
    xhr.open('POST', '/', true);
    xhr.send(fd);
    var file = new File([blob], "KJfilenam", { type: "image/jpeg"});
};

/*this will convert a dataURI to a Blob:-*/

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
//From there, appending the data to a form such that it will be uploaded as a file is easy:

//var dataURL = canvas.toDataURL('image/jpeg', 0.5);
//var blob = dataURItoBlob(dataURL);

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);