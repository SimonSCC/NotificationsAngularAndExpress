//Skal vi have recipient med?
//Måske et id på requesten der er tilkoblet streamen
//Så kan vi også tjekke om det er den samme, hvis det er kan request liste nblive overskrevet

import { NotificationObject } from "./Models/NotificationObject.js";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
var responses = new Array();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/AboutMe", (req, res) => {
  res.sendFile(__dirname + "/aboutme.html");
});

app.get("/stream", (req, res) => {
  responses.push(res);
  res.setHeader("Content-Type", "text/event-stream");

  InitiateStream(res);
});

app.post("/sendNotification", (req, res) => {
  console.log("PostRequest received");
  console.log(req.body.From);

  let from: string = req.body.From;
  let message: string = req.body.Message;
  let imgurl: string = req.body.ImgUrl;

  if (req.body.From == null) from = "NoSender";

  if (req.body.Message == null) message = "NoMessage";
  if (req.body.ImgUrl == null) imgurl = "";

  console.log("\nRetrieved post request " + from + " " + message + " " + imgurl + "\n");

  let notification: NotificationObject = new NotificationObject(from, message, imgurl);

  res.setHeader("Content-Type", "text/event-stream");
  SendNotification(notification);

  res.send(`You've succesfully sent your notification: ${from}, ${message}, ${imgurl}`);
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
  setTimeout(() => CurrentActiveStreams(), 5000);
});

function InitiateStream(res: any) {
  let notification: NotificationObject = new NotificationObject("Simon", "You've succesfully connected to the stream!", "");
  console.log("Created notification\n" + notification.From, notification.NotificationMessage);
  // res.write("event: ping\n");

  // res.write("event: Notification\n")
  res.write("data: " + JSON.stringify(notification));
  res.write("\n\n");
  // res.write("data: " + "Title:Notification; Message: You've succesfully connected to the stream!\n\n"); //This is one event
  // setTimeout(() => InitiateStream(res), 5000);
}

function SendNotification(notification: NotificationObject) {
  responses.forEach((res) => {
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
  setTimeout(() => CurrentActiveStreams(), 10000);
}
