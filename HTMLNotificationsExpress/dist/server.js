"use strict";
//Skal vi have recipient med?
//Måske et id på requesten der er tilkoblet streamen
//Så kan vi også tjekke om det er den samme, hvis det er kan request liste nblive overskrevet
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var NotificationHandler_js_1 = require("./services/NotificationHandler.js");
// const querystring = require("querystring");
// const https = require("https");
var counter = 0;
var db = {};
// const conn = new MongoDataAccess("mongodb+srv://dbUser:dbUserPassword@cluster0.eouu4.mongodb.net/test");
var app = express_1.default();
var port = 3000;
var _NotificationHandler = new NotificationHandler_js_1.NotificationHandler();
//MiddleWare:
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
app.use(cors_1.default({
    origin: "http://localhost:4200",
}));
app.use(express_1.default.urlencoded()); //Parse URL-encoded bodies
app.use(express_1.default.json());
app.use(express_1.default.static(__dirname + "/public"));
//Executes middleware globally
// app.use(authMiddleware);
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/AboutMe", function (req, res) {
    res.sendFile(__dirname + "/aboutme.html");
});
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
    _NotificationHandler.AddListener(req, res);
});
app.post("/sendNotification", function (req, res) {
    _NotificationHandler.SendNotification(_NotificationHandler.CreateNotification(req), res);
});
// start the Express server
app.listen(port, function () {
    console.log("server started at http://localhost:" + port);
});
app.get("/stream/:user", function (req, res) {
    _NotificationHandler.AddListener(req, res);
});
