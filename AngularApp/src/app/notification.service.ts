import { Injectable } from '@angular/core';

//Decorater
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}

//Håndtere kontinuerlige strømme af data er det godt at arbejde med observables
// return this.httpClient.get('http://localhost:3000/get-data');
