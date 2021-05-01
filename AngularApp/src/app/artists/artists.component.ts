import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-artists',
  templateUrl: 'artists.component.html',
  styleUrls: ['./artists.component.scss'],
})
export class ArtistsComponent implements OnInit {
  query: string;
  artists: any;
  title = 'AngularLinkedInTutMine';
  // inpText: string = '';

  showArtist(event: any, artist: any) {
    // console.log(event);

    this.query = artist.name;
    artist.highlight = !artist.highlight;
  }

  constructor(private http: HttpClient) {
    this.query = '';
  }

  ngOnInit(): void {
    this.http.get<Object>('../assets/data/data.json').subscribe((data) => {
      this.artists = data;
    });
  }
}
