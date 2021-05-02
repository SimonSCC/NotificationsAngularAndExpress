export class NotificationObject {
  From: string;
  NotificationMessage: string;
  ImgUrl: string;
  Date: string;
  Recipient: string;

  /**
   *
   */
  constructor(from: string, notificationMessage: string, imgUrl: string, recipient: string) {
    this.From = from;
    this.NotificationMessage = notificationMessage;
    this.ImgUrl = imgUrl;
    this.Date = new Date().toLocaleString();
    this.Recipient = recipient;
  }
}
