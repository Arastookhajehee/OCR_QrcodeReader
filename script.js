let capture;
let captureGraphic;
let socket;
let socketCondition;
let sendButton;
let QRString;
let socketIsConnected = false;
const appWidth = 400;
const appHeight = 640;
const windowWidth = 400;
const windowHeight = 640;
const debuggingArea = 500;

function setup() {
    console.log("appWidth : " + appWidth);
    console.log("appHeight : " + appHeight);

    pixelDensity(1);
	createCanvas(windowWidth, windowHeight);
    console.log("windowWidth : " + windowWidth);
    console.log("windowHeight : " + windowHeight);
    console.log("window.innerWidth : " + window.innerWidth);
    console.log("window.innerHeight : " + window.innerHeight);
    // background(0);

	captureGraphic = createGraphics(appWidth, appHeight);
    console.log("captureGraphic.width : " + captureGraphic.width);
    console.log("captureGraphic.height : " + captureGraphic.height);

    var constraints = {
        audio: false,
        video: {
            facingMode: "environment",
            width: appWidth,
            height: appHeight
        }
    };
	capture = createCapture(constraints);
    capture.size(appWidth, appHeight);
	capture.hide();

    console.log("capture.width : " + capture.width);
    console.log("capture.height : " + capture.height);

    connectButton = createButton("connect");
    connectButton.position(300, debuggingArea + 20);
    connectButton.mousePressed(connectSocket);

    sendQRButton = createButton("sendQR");
    sendQRButton.position(300, debuggingArea + 75);
    sendQRButton.mousePressed(sendQRString);

    sendButton = createButton("sendText");
    sendButton.position(300, debuggingArea + 105);
    sendButton.mousePressed(sendSocket);

    server = createInput();
    server.position(135, debuggingArea + 20);
    server.style("width", "150px");

    sendText = createInput();
    sendText.position(140, debuggingArea + 105);
    sendText.style("width", "150px");

    oneForthURL = createA("./third/third.html", "Server 14");
    oneForthURL.position(30, debuggingArea - 10);
    oneForthURL.style("color", "white");

    oneFifthURL = createA("./first/first.html", "Server 15");
    oneFifthURL.position(160, debuggingArea - 10);
    oneFifthURL.style("color", "white");

    oneSixthURL = createA("./second/second.html", "Server 16");
    oneSixthURL.position(290, debuggingArea - 10);
    oneSixthURL.style("color", "white");
}

function draw() {
    clear();
    background(0);

    // let resizedCap = capture.get(capture.width / 2 - appWidth / 2, capture.height / 2 - debuggingArea / 2, appWidth, debuggingArea);
    let resizedCap = capture.get(0,0, appWidth, debuggingArea);

	// image(capture, 0, 0, capture.width, capture.height);
    image(resizedCap, 0, 0);
	// image(capture, 0, 0);

    fill(0);
    rect(0, debuggingArea - 20, appWidth, appHeight);

    fill(0);
    textSize(20);
    text("Custom Server URL", 10, 35);
	let code = getCodeFromCapture(capture, captureGraphic);
	if (code) {
		// text(code.data, 10, appHeight - 10);
        QRString = code.data;
		// text("QRCode : " + QRString.data, 10, debuggingArea + 10);
        // if(socketCondition == 1){
        //     socket.send(code.data);
        // }
	}
    fill(255);
	text("QRCode : " + QRString, 10, debuggingArea + 95);
    text("Server URL : ", 10, debuggingArea + 35);

    checkSocket();
    text(socketCondition, 10, debuggingArea + 65);
    text("Custom Text : ", 10, debuggingArea + 125);

}

function connectSocket(){
    socket = new WebSocket(server.value());
    socketIsConnected = true;
}

function checkSocket(){
    socketCondition = "no connection";
    if(socketIsConnected){
        if(socket.readyState == 0){
            socketCondition = "connecting";
        }else if(socket.readyState == 1){
            socketCondition = "connected";
        }else if(socket.readyState == 3){
            socketCondition = "no connection";
        }
    }
}

function sendSocket(){
    socket.send(sendText.value());
}

function sendQRString(){
    socket.send(QRString);
}

// function mouseClicked(){
//     socket.send("Mouse Clicked!");
//     // return false;
// }

function getCodeFromCapture(cap, g) {
	g.image(cap, 0, 0, cap.width, cap.height);
	const imgData = g.elt
		.getContext('2d')
		.getImageData(0, 0, cap.width, cap.height).data;

	return jsQR(imgData, cap.width, cap.height);
}