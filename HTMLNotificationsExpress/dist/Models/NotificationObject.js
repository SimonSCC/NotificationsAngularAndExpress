"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationObject = void 0;
var NotificationObject = /** @class */ (function () {
    /**
     *
     */
    function NotificationObject(from, notificationMessage, imgUrl) {
        this.From = from;
        this.NotificationMessage = notificationMessage;
        this.ImgUrl = imgUrl;
        this.Date = new Date().toLocaleString();
    }
    return NotificationObject;
}());
exports.NotificationObject = NotificationObject;
