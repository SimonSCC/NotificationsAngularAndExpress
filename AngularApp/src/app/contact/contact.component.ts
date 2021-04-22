import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  listForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });

  notifications = [
    { id: 123, name: 'Simon' },
    { id: 32, name: 'Niels' },
    { id: 12123, name: 'Mads' },
  ];

  // name = new FormControl('');

  updateName() {
    this.listForm.setValue({ name: 'Simon', email: '' });
    console.log(this.listForm.value.name);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.listForm.value);
    this.notifications.push({ id: 12, name: this.listForm.value.name });
  }

  constructor() {}
  /*Use the constructor of FormControl to set its initial value, which in this case is an empty string. By creating these controls in your component class, you get immediate access to listen for, update, and validate the state of the form input.*/
}
