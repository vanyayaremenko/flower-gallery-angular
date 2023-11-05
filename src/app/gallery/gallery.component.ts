import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface GalleryImage {
  src: string;
  title: string;
  description: string;
}

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  title = 'Explosion gallery';
  images: GalleryImage[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient
      .get<GalleryImage[]>('../../assets/images-data.json')
      .subscribe((data) => {
        this.images = data;
      });
  }
}
