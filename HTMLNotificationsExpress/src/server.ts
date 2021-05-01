//Skal vi have recipient med?
//Måske et id på requesten der er tilkoblet streamen
//Så kan vi også tjekke om det er den samme, hvis det er kan request liste nblive overskrevet

import { NotificationObject } from "./Models/NotificationObject.js";
import express, { json } from "express";
import cors from "cors";
import { MongoDataAccess } from "./data/mongoDataAccess.js";
import fetch from "node-fetch";
import JWT from "jsonwebtoken";

// const querystring = require("querystring");
// const https = require("https");
let counter = 0;
const db: { [key: number]: string } = {};

const authMiddleware = (req: any, res: any, next: any) => {
  try {
    console.log("Executing middleware!");
    if (!req.body) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          message: "u fuk up nothin here",
        })
      );
      return;
    }

    if (!req.body.id) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          message: "u fuk up no id",
        })
      );
      return;
    }
    JWT.verify(req.body.id, "dragonite", (err: any, obj: any) => {
      if (err) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "u fuk up random fuk u ps invaild jwt string ",
          })
        );
        return;
      }
      if (obj.counter == null) {
        console.log(obj);
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "u fuk up no counter",
          })
        );
        return;
      }
      console.log(db);
      console.log(obj.counter);
      if (db[obj.counter]) {
        next();
      } else {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            message: "u fuk up counter no existss",
          })
        );
      }
    });
  } catch (error) {
    res.statusCode = 401;
    res.end(
      JSON.stringify({
        message: "u fuk up no jason" + error,
      })
    );
    return;
  }
};

// const conn = new MongoDataAccess("mongodb+srv://dbUser:dbUserPassword@cluster0.eouu4.mongodb.net/test");

const app = express();
const port = 3000;
var responses = new Array();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

//Executes middleware globally
// app.use(authMiddleware);

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/AboutMe", (req, res) => {
  res.sendFile(__dirname + "/aboutme.html");
});

// app.get("/authSecond", (req, res) => {
//   res.end("AuthSecondHere");
// });
app.post("/secretcontent", authMiddleware, (req, res) => {
  res.send("OKAAAWEY 1");
});

app.post("/secretcontent2", (req, res) => {
  res.send("Secret 2");
});

app.get("/auth", (req, res) => {
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

  fetch("https://oauth2.googleapis.com/token", {
    method: "post",
    body: JSON.stringify({
      code: req.query.code,
      client_id: "102834417830-blnrk2ovn4rhvrisn6ecdsv01988p6mp.apps.googleusercontent.com",
      client_secret: "_t0ARYGy9N9d9436LqGQd8Bn",
      redirect_uri: "http://localhost:3000/auth",
      grant_type: "authorization_code",
    }),
  })
    .then((r: any) => r.json())
    .then((r: any) => {
      JWT.sign({ counter }, "dragonite", { expiresIn: "1h" }, (err, id: any) => {
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

app.get("/stream", (req, res) => {
  responses.push(res);
  res.setHeader("Content-Type", "text/event-stream");

  InitiateStream(res);
});

app.post("/sendNotification", (req, res) => {
  console.log("PostRequest received");
  console.log(req.body.From);

  let recipient: string = req.body.Recipient;
  let from: string = req.body.From;
  let message: string = req.body.Message;
  let imgurl: string = req.body.ImgUrl;

  if (req.body.From == null) from = "NoSender";

  if (req.body.Message == null) message = "NoMessage";
  if (req.body.ImgUrl == null) imgurl = "";

  console.log("\nRetrieved post request " + "To: " + recipient + " " + from + " " + message + " " + imgurl + "\n");

  let notification: NotificationObject = new NotificationObject(from, message, imgurl);

  res.setHeader("Content-Type", "text/event-stream");

  if (recipient == "" || recipient == undefined) {
    SendNotification(notification);
  } else {
    SendNotificationToSpecificStream(notification, recipient);
  }

  res.send(`You've succesfully sent your notification: ${from}, ${message}, ${imgurl}`);
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  setTimeout(() => CurrentActiveStreams(), 5000);
});

function InitiateStream(res: any) {
  let notification: NotificationObject = new NotificationObject("Welcome", "You've succesfully connected to the stream!", "");
  console.log("Created notification\n" + notification.From, notification.NotificationMessage);
  // res.write("event: ping\n");

  // res.write("event: Notification\n")
  res.write("data: " + JSON.stringify(notification));
  res.write("\n\n");
  // res.write("data: " + "Title:Notification; Message: You've succesfully connected to the stream!\n\n"); //This is one event
  // setTimeout(() => InitiateStream(res), 5000);
}

function SendNotification(notification: NotificationObject) {
  // conn.insertMany([notification], "notifications");

  responses.forEach((res) => {
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
  setTimeout(() => CurrentActiveStreams(), 10000);
}

//Attempt:

let userResponses: any = [];

app.get("/stream/:user", (req, res) => {
  // res.write.User = userSimon;
  userResponses.push({ StreamName: req.params.user, response: res });

  res.setHeader("Content-Type", "text/event-stream");

  InitiateStream(res);
});

function SendNotificationToSpecificStream(notification: NotificationObject, streamName: string) {
  console.log("SendNotiToSpecific" + streamName);
  userResponses.forEach((object: any) => {
    // console.log(userResponses);
    // console.log(res.body.User);
    // console.log(streamName);
    if (object.StreamName == streamName) {
      object.response.write("data: " + JSON.stringify(notification));
      object.response.write("\n\n");
    }
  });
}
