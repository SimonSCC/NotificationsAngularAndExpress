import { Component, OnInit, NgZone } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.css'],
})
export class NotificationPageComponent implements OnInit {
  faBell = faBell;
  faX = faTimesCircle;
  Notifications: any[] = [];

  constructor(
    private notificationService: NotificationService,
    private zone: NgZone
  ) {
    this.CreateObservable().subscribe((event: any) =>
      this.NotificationReceived(event.data)
    );
  }

  CreateObservable() {
    return new Observable((subscriber) => {
      const stream = this.notificationService.getEventSource(
        'http://localhost:3000/stream'
      );

      stream.onmessage = (event) => {
        this.zone.run(() => {
          subscriber.next(event);
        });
      };
    });
  }

  NotificationReceived(data: any) {
    this.Notifications.push(JSON.parse(data));
    console.log(data);
    console.log(this.Notifications.length);
  }

  XClicked(index: any) {
    this.Notifications.splice(index, 1);
  }

  ngOnInit(): void {}
}
