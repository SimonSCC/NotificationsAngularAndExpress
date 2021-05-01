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
var node_fetch_1 = __importDefault(require("node-fetch"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const querystring = require("querystring");
// const https = require("https");
var counter = 0;
var db = {};
var authMiddleware = function (req, res, next) {
    try {
        console.log("Executing middleware!");
        if (!req.body) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                message: "u fuk up nothin here",
            }));
            return;
        }
        if (!req.body.id) {
            res.statusCode = 401;
            res.end(JSON.stringify({
                message: "u fuk up no id",
            }));
            return;
        }
        jsonwebtoken_1.default.verify(req.body.id, "dragonite", function (err, obj) {
            if (err) {
                res.statusCode = 401;
                res.end(JSON.stringify({
                    message: "u fuk up random fuk u ps invaild jwt string ",
                }));
                return;
            }
            if (obj.counter == null) {
                console.log(obj);
                res.statusCode = 401;
                res.end(JSON.stringify({
                    message: "u fuk up no counter",
                }));
                return;
            }
            console.log(db);
            console.log(obj.counter);
            if (db[obj.counter]) {
                next();
            }
            else {
                res.statusCode = 401;
                res.end(JSON.stringify({
                    message: "u fuk up counter no existss",
                }));
            }
        });
    }
    catch (error) {
        res.statusCode = 401;
        res.end(JSON.stringify({
            message: "u fuk up no jason" + error,
        }));
        return;
    }
};
// const conn = new MongoDataAccess("mongodb+srv://dbUser:dbUserPassword@cluster0.eouu4.mongodb.net/test");
var app = express_1.default();
var port = 3000;
var responses = new Array();
app.use(cors_1.default({
    origin: "http://localhost:4200",
}));
//Executes middleware globally
// app.use(authMiddleware);
app.use(express_1.default.urlencoded()); //Parse URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/AboutMe", function (req, res) {
    res.sendFile(__dirname + "/aboutme.html");
});
// app.get("/authSecond", (req, res) => {
//   res.end("AuthSecondHere");
// });
app.post("/secretcontent", authMiddleware, function (req, res) {
    res.send("OKAAAWEY 1");
});
app.post("/secretcontent2", function (req, res) {
    res.send("Secret 2");
});
app.get("/auth", function (req, res) {
    // console.log(req);
    // let endpoint = "https://oauth2.googleapis.com/token";
    // var postData = querystring.stringify({
    //   code: req.query.code,
    //   client_id: "102834417830-blnrk2ovn4rhvrisn6ecdsv01988p6mp.apps.googleusercontent.com",
    //   client_secret: "_t0ARYGy9N9d9436LqGQd8Bn",
    //   redirect_uri: "http://localhost:3000/auth",
    //   grant_type: "authorization_code",
    // });
    var options = {
        hostname: "oauth2.googleapis.com",
        path: "/token",
        port: 443,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    // var request = https.request(options, (response: any) => {
    //   console.log("statusCode:", response.statusCode);
    //   console.log("headers:", response.headers);
    //   response.on("data", (d: any) => {
    //     process.stdout.write(d);
    //   });
    // });
    // request.on("error", (e: any) => {
    //   console.error(e);
    // });
    // request.write(postData);
    // request.end();
    node_fetch_1.default("https://oauth2.googleapis.com/token", {
        method: "post",
        body: JSON.stringify({
            code: req.query.code,
            client_id: "102834417830-blnrk2ovn4rhvrisn6ecdsv01988p6mp.apps.googleusercontent.com",
            client_secret: "_t0ARYGy9N9d9436LqGQd8Bn",
            redirect_uri: "http://localhost:3000/auth",
            grant_type: "authorization_code",
        }),
    })
        .then(function (r) { return r.json(); })
        .then(function (r) {
        jsonwebtoken_1.default.sign({ counter: counter }, "dragonite", { expiresIn: "1h" }, function (err, id) {
            //Id token og access token må aldrig blvie sendt til klienten
            console.log("id:" + id);
            console.log("counter: " + counter);
            console.log(err);
            db[counter] = r.access_token;
            console.log(db);
            counter++;
            res.redirect("http://localhost:4200/?id=" + id);
        });
    });
    // console.log("_________________________");
    // console.log(req.query.code);
});
app.get("/stream", function (req, res) {
    responses.push(res);
    res.setHeader("Content-Type", "text/event-stream");
    InitiateStream(res);
});
app.post("/sendNotification", function (req, res) {
    console.log("PostRequest received");
    console.log(req.body.From);
    var recipient = req.body.Recipient;
    var from = req.body.From;
    var message = req.body.Message;
    var imgurl = req.body.ImgUrl;
    if (req.body.From == null)
        from = "NoSender";
    if (req.body.Message == null)
        message = "NoMessage";
    if (req.body.ImgUrl == null)
        imgurl = "";
    console.log("\nRetrieved post request " + "To: " + recipient + " " + from + " " + message + " " + imgurl + "\n");
    var notification = new NotificationObject_js_1.NotificationObject(from, message, imgurl);
    res.setHeader("Content-Type", "text/event-stream");
    if (recipient == "" || recipient == undefined) {
        SendNotification(notification);
    }
    else {
        SendNotificationToSpecificStream(notification, recipient);
    }
    res.send("You've succesfully sent your notification: " + from + ", " + message + ", " + imgurl);
});
// start the Express server
app.listen(port, function () {
    console.log("server started at http://localhost:" + port);
    setTimeout(function () { return CurrentActiveStreams(); }, 5000);
});
function InitiateStream(res) {
    var notification = new NotificationObject_js_1.NotificationObject("Welcome", "You've succesfully connected to the stream!", "");
    console.log("Created notification\n" + notification.From, notification.NotificationMessage);
    // res.write("event: ping\n");
    // res.write("event: Notification\n")
    res.write("data: " + JSON.stringify(notification));
    res.write("\n\n");
    // res.write("data: " + "Title:Notification; Message: You've succesfully connected to the stream!\n\n"); //This is one event
    // setTimeout(() => InitiateStream(res), 5000);
}
function SendNotification(notification) {
    // conn.insertMany([notification], "notifications");
    responses.forEach(function (res) {
        res.write("data: " + JSON.stringify(notification));
        res.write("\n\n");
    });
    console.log(responses.length);
    //Might result in multiple open resopnses
}
function CurrentActiveStreams() {
    console.log("Current active streams: " + responses.length);
    // conn.findDocument("notifications");
    // responses.forEach(res => {
    //     console.log(res);
    // });
    setTimeout(function () { return CurrentActiveStreams(); }, 10000);
}
//Attempt:
var userResponses = [];
app.get("/stream/:user", function (req, res) {
    // res.write.User = userSimon;
    userResponses.push({ StreamName: req.params.user, response: res });
    res.setHeader("Content-Type", "text/event-stream");
    InitiateStream(res);
});
function SendNotificationToSpecificStream(notification, streamName) {
    console.log("SendNotiToSpecific" + streamName);
    userResponses.forEach(function (object) {
        // console.log(userResponses);
        // console.log(res.body.User);
        // console.log(streamName);
        if (object.StreamName == streamName) {
            object.response.write("data: " + JSON.stringify(notification));
            object.response.write("\n\n");
        }
    });
}
