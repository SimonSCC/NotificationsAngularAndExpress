import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @Input() textFromOtherComponent: string;

  altText: string;
  //   inpText: string = '';
  constructor() {
    this.altText = 'Mit virksomhedsnavn';
    this.textFromOtherComponent = '';
  }

  ngOnInit(): void {}

  getValue(): string {
    return 'Value from method';
  }
}
