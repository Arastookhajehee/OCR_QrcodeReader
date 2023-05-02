let capture;
let captureGraphic;
let socket;
let socketCondition = 0;
let sendButton;
let QRString;
let socketIsConnected = false;
const windowWidth = 400;
const windowHeight = 640;
const debuggingArea = 500;

function setup() {
    console.log("windowWidth : " + windowWidth);
    console.log("windowHeight : " + windowHeight);

    pixelDensity(1);
	createCanvas(windowWidth, windowHeight);
    // background(14, 60, 82);

	captureGraphic = createGraphics(windowWidth, windowHeight);
    console.log("captureGraphic.width : " + captureGraphic.width);
    console.log("captureGraphic.height : " + captureGraphic.height);

    var constraints = {
        audio: false,
        video: {
            facingMode: "environment",
            width: windowWidth,
            height: windowHeight
        }
    };
	capture = createCapture(constraints);
    capture.size(windowWidth, debuggingArea);
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

    server = createInput("wss://remosharp-public-server15.glitch.me/");
    server.position(135, debuggingArea + 20);
    server.style("width", "150px");

    sendText = createInput();
    sendText.position(140, debuggingArea + 105);
    sendText.style("width", "150px");
    
    oneForthURL = createA("../third/third.html", "Server 14");
    oneForthURL.position(30, debuggingArea - 10);
    oneForthURL.style("color", "white");

    oneFifthURL = createA("../first/first.html", "Server 15");
    oneFifthURL.position(160, debuggingArea - 10);
    oneFifthURL.style("color", "white");

    oneSixthURL = createA("../second/second.html", "Server 16");
    oneSixthURL.position(290, debuggingArea - 10);
    oneSixthURL.style("color", "white");
}

function draw() {
    clear();
    background(14, 60, 82);
	image(capture, 0, 0, capture.width, capture.height);

    fill(14, 60, 82);
    rect(0, debuggingArea - 20, windowWidth, windowHeight);

    fill(0);
    textSize(20);
    text("Server 15", 10, 35);
	let code = getCodeFromCapture(capture, captureGraphic);
	if (code) {
		// text(code.data, 10, windowHeight - 10);
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
