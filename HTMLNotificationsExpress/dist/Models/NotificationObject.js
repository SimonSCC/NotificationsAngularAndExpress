"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationObject = void 0;
var NotificationObject = /** @class */ (function () {
    /**
     *
     */
    function NotificationObject(from, notificationMessage, imgUrl, recipient) {
        this.From = from;
        this.NotificationMessage = notificationMessage;
        this.ImgUrl = imgUrl;
        this.Date = new Date().toLocaleString();
        this.Recipient = recipient;
    }
    return NotificationObject;
}());
exports.NotificationObject = NotificationObject;
