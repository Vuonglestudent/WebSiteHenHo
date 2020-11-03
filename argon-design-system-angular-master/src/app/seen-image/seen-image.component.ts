import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seen-image',
  templateUrl: './seen-image.component.html',
  styleUrls: ['./seen-image.component.css']
})
export class SeenImageComponent implements OnInit {

  @Input() image
  constructor() { }

  arrayImage = ['./assets/img/theme/img-1-1200x1000.jpg', './assets/img/theme/img-2-1200x1000', './assets/img/theme/landing.jpg', './assets/img/theme/profile.jpg']
  ngOnInit(): void {

  }
}
