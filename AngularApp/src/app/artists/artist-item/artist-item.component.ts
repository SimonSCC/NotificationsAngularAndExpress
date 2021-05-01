import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
})
export class ArtistItemComponent implements OnInit {
  @Input() artistitem!: any;

  constructor() {}
  ngOnInit(): void {}
}
