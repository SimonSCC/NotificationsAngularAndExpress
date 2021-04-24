import { Component, OnInit, NgZone } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.css'],
})
export class NotificationPageComponent implements OnInit {
  faBell = faBell;
  faX = faTimesCircle;
  Notifications: any[] = [];
  ConnectedStreamName: String = 'Default';

  streamName = new FormControl();

  currentStreamURL: string = 'http://localhost:3000/stream';
  EventStream: EventSource;

  constructor(
    private notificationService: NotificationService,
    private zone: NgZone
  ) {
    this.EventStream = this.notificationService.getEventSource(
      this.currentStreamURL
    );

    this.StartStream();
  }

  StartStream() {
    this.CreateObservable().subscribe((event: any) =>
      this.NotificationReceived(event.data)
    );
  }

  CloseCurrentStream() {
    this.EventStream.close();
  }

  CreateObservable() {
    return new Observable((subscriber) => {
      // this.EventStream = this.notificationService.getEventSource(url);
      this.EventStream;

      this.EventStream.onmessage = (event) => {
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

  ChangeNotificationStream() {
    console.log(this.streamName.value);

    let newStreamName;

    if (this.streamName.value == null || this.streamName.value.length < 1) {
      newStreamName = 'Default';
    } else {
      newStreamName = this.streamName.value;
    }
    this.CloseCurrentStream();

    if (newStreamName == 'Default') {
      this.currentStreamURL = `http://localhost:3000/stream`;
    } else {
      this.currentStreamURL = `http://localhost:3000/stream/${newStreamName}`;
    }

    this.EventStream = this.notificationService.getEventSource(
      this.currentStreamURL
    );
    this.StartStream();

    this.ConnectedStreamName = newStreamName;
  }
}
