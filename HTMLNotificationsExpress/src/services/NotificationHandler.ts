import { NotificationObject } from "../Models/NotificationObject";

export class NotificationHandler {
  ResponseListeners: Array<any>;

  constructor() {
    this.ResponseListeners = new Array<any>();
    setTimeout(() => this.PrintCurrentActiveStreams(), 5000);
  }

  AddListener(req: any, res: any) {
    res.setHeader("Content-Type", "text/event-stream");
    let streamName = req.params.user;
    if (streamName == undefined || streamName.length <= 1) streamName = "Default";

    this.ResponseListeners.push({ StreamName: streamName, response: res });
    this.DisplayWelcomeMessage(res);
  }

  DisplayWelcomeMessage(res: any) {
    let notification: NotificationObject = new NotificationObject("Welcome", "You've succesfully connected to the stream!", "", "");
    res.write("data: " + JSON.stringify(notification));
    res.write("\n\n");
  }

  SendNotification(Notification: NotificationObject, resonse: any) {
    resonse.setHeader("Content-Type", "text/event-stream");

    this.ResponseListeners.forEach((object: any) => {
      if (object.StreamName == Notification.Recipient) {
        object.response.write("data: " + JSON.stringify(Notification));
        object.response.write("\n\n");
      }
    });

    resonse.send(`You've succesfully sent your notification: ${Notification.From}, ${Notification.NotificationMessage}, ${Notification.ImgUrl}`);
  }

  PrintCurrentActiveStreams() {
    console.log("Current active streams: " + this.ResponseListeners.length);
    setTimeout(() => this.PrintCurrentActiveStreams(), 10000);
  }

  CreateNotification(request: any): NotificationObject {
    console.log("PostRequest received");
    console.log(request.body.From);

    let recipient: string = request.body.Recipient;
    let from: string = request.body.From;
    let message: string = request.body.Message;
    let imgurl: string = request.body.ImgUrl;

    if (request.body.From == null) from = "NoSender";
    if (recipient.length <= 1) recipient = "Default";
    if (request.body.Message == null) message = "NoMessage";
    if (request.body.ImgUrl == null) imgurl = "";

    console.log("\nRetrieved post request " + "To: " + recipient + " " + from + " " + message + " " + imgurl + "\n");

    return new NotificationObject(from, message, imgurl, recipient);
  }
}
