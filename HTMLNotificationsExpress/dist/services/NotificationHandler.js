"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationHandler = void 0;
var NotificationObject_1 = require("../Models/NotificationObject");
var NotificationHandler = /** @class */ (function () {
    function NotificationHandler() {
        var _this = this;
        this.ResponseListeners = new Array();
        setTimeout(function () { return _this.PrintCurrentActiveStreams(); }, 5000);
    }
    NotificationHandler.prototype.AddListener = function (req, res) {
        res.setHeader("Content-Type", "text/event-stream");
        var streamName = req.params.user;
        if (streamName == undefined || streamName.length <= 1)
            streamName = "Default";
        this.ResponseListeners.push({ StreamName: streamName, response: res });
        this.DisplayWelcomeMessage(res);
    };
    NotificationHandler.prototype.DisplayWelcomeMessage = function (res) {
        var notification = new NotificationObject_1.NotificationObject("Welcome", "You've succesfully connected to the stream!", "", "");
        res.write("data: " + JSON.stringify(notification));
        res.write("\n\n");
    };
    NotificationHandler.prototype.SendNotification = function (Notification, resonse) {
        resonse.setHeader("Content-Type", "text/event-stream");
        this.ResponseListeners.forEach(function (object) {
            if (object.StreamName == Notification.Recipient) {
                object.response.write("data: " + JSON.stringify(Notification));
                object.response.write("\n\n");
            }
        });
        resonse.send("You've succesfully sent your notification: " + Notification.From + ", " + Notification.NotificationMessage + ", " + Notification.ImgUrl);
    };
    NotificationHandler.prototype.PrintCurrentActiveStreams = function () {
        var _this = this;
        console.log("Current active streams: " + this.ResponseListeners.length);
        setTimeout(function () { return _this.PrintCurrentActiveStreams(); }, 10000);
    };
    NotificationHandler.prototype.CreateNotification = function (request) {
        console.log("PostRequest received");
        console.log(request.body.From);
        var recipient = request.body.Recipient;
        var from = request.body.From;
        var message = request.body.Message;
        var imgurl = request.body.ImgUrl;
        if (request.body.From == null)
            from = "NoSender";
        if (recipient.length <= 1)
            recipient = "Default";
        if (request.body.Message == null)
            message = "NoMessage";
        if (request.body.ImgUrl == null)
            imgurl = "";
        console.log("\nRetrieved post request " + "To: " + recipient + " " + from + " " + message + " " + imgurl + "\n");
        return new NotificationObject_1.NotificationObject(from, message, imgurl, recipient);
    };
    return NotificationHandler;
}());
exports.NotificationHandler = NotificationHandler;
