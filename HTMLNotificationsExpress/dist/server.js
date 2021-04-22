"use strict";
//Skal vi have recipient med?
//Måske et id på requesten der er tilkoblet streamen
//Så kan vi også tjekke om det er den samme, hvis det er kan request liste nblive overskrevet
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NotificationObject_js_1 = require("./Models/NotificationObject.js");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app = express_1.default();
var port = 3000;
var responses = new Array();
app.use(cors_1.default({
    origin: "http://localhost:4200",
}));
app.use(express_1.default.urlencoded()); //Parse URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/AboutMe", function (req, res) {
    res.sendFile(__dirname + "/aboutme.html");
});
app.get("/stream", function (req, res) {
    responses.push(res);
    res.setHeader("Content-Type", "text/event-stream");
    InitiateStream(res);
});
app.post("/sendNotification", function (req, res) {
    console.log("PostRequest received");
    console.log(req.body.From);
    var from = req.body.From;
    var message = req.body.Message;
    var imgurl = req.body.ImgUrl;
    if (req.body.From == null)
        from = "NoSender";
    if (req.body.Message == null)
        message = "NoMessage";
    if (req.body.ImgUrl == null)
        imgurl = "";
    console.log("\nRetrieved post request " + from + " " + message + " " + imgurl + "\n");
    var notification = new NotificationObject_js_1.NotificationObject(from, message, imgurl);
    res.setHeader("Content-Type", "text/event-stream");
    SendNotification(notification);
    res.send("You've succesfully sent your notification: " + from + ", " + message + ", " + imgurl);
});
// start the Express server
app.listen(port, function () {
    console.log("server started at http://localhost:" + port);
    setTimeout(function () { return CurrentActiveStreams(); }, 5000);
});
function InitiateStream(res) {
    var notification = new NotificationObject_js_1.NotificationObject("Simon", "You've succesfully connected to the stream!", "");
    console.log("Created notification\n" + notification.From, notification.NotificationMessage);
    // res.write("event: ping\n");
    // res.write("event: Notification\n")
    res.write("data: " + JSON.stringify(notification));
    res.write("\n\n");
    // res.write("data: " + "Title:Notification; Message: You've succesfully connected to the stream!\n\n"); //This is one event
    // setTimeout(() => InitiateStream(res), 5000);
}
function SendNotification(notification) {
    responses.forEach(function (res) {
        res.write("data: " + JSON.stringify(notification));
        res.write("\n\n");
    });
    console.log(responses.length);
    //Might result in multiple open resopnses
}
function CurrentActiveStreams() {
    console.log("Current active streams: " + responses.length);
    // responses.forEach(res => {
    //     console.log(res);
    // });
    setTimeout(function () { return CurrentActiveStreams(); }, 10000);
}
