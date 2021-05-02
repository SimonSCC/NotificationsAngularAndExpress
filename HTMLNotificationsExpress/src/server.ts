//Skal vi have recipient med?
//Måske et id på requesten der er tilkoblet streamen
//Så kan vi også tjekke om det er den samme, hvis det er kan request liste nblive overskrevet

import { NotificationObject } from "./Models/NotificationObject.js";
import express, { json } from "express";
import cors from "cors";
import { MongoDataAccess } from "./data/mongoDataAccess.js";
import fetch from "node-fetch";
import JWT from "jsonwebtoken";
import { NotificationHandler } from "./services/NotificationHandler.js";

// const querystring = require("querystring");
// const https = require("https");

let counter = 0;
const db: { [key: number]: string } = {};
// const conn = new MongoDataAccess("mongodb+srv://dbUser:dbUserPassword@cluster0.eouu4.mongodb.net/test");
const app = express();
const port = 3000;
const _NotificationHandler = new NotificationHandler();

//MiddleWare:
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

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.use(express.urlencoded()); //Parse URL-encoded bodies
app.use(express.json());

app.use(express.static(__dirname + "/public"));

//Executes middleware globally
// app.use(authMiddleware);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/AboutMe", (req, res) => {
  res.sendFile(__dirname + "/aboutme.html");
});

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
  _NotificationHandler.AddListener(req, res);
});

app.post("/sendNotification", (req, res) => {
  _NotificationHandler.SendNotification(_NotificationHandler.CreateNotification(req), res);
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

app.get("/stream/:user", (req, res) => {
  _NotificationHandler.AddListener(req, res);
});
