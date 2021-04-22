import { Component } from '@angular/core';
// import { Observable } from 'rxjs';
// import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // // Person: Observable<object>;
  // Person: string = '';
  // constructor(private notificationService: NotificationService) {
  //   notificationService.getDataObservable().subscribe(
  //     (suc: any) => {
  //       // console.log(suc);
  //       // this.Person = JSON.stringify(suc);
  //       this.Person = suc.name;
  //     }, //Success
  //     (err) => {
  //       console.log(err);
  //     }, //Error
  //     () => {
  //       console.log('Under any circumstances');
  //     } //Any
  //   );
  // fetch('http://localhost:3000/get-data')
  //   .then((response) => response.json()) // {name : Simon, age: 25}
  //   .then((obj) => obj.name.toUpperCase() + ' ' + obj.age) // SIMON 25. Tror også man kan sige obj.name og lave det om, og stadig have strukturen på dataen.
  //   .then((data) => (this.Person = data)); // binding {{}}
  //This is called chaining
  //This has something to do with Imperitive vs declarative programming
  //C # er primært imperative programming
}
// }

//The promise objrect represents the eventual
//completion or failure of an asynchronus operation and its resulting value

//A promise is one of the states:
//Pending,
//Fufilled
//Rejected

//Fetch basere sig på promise.

//der er async og await

//Det nyeste er observables

//rxJS
