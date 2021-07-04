import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../shared/_animates/animates';
@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
  animations: [slideInOutAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@slideInOutAnimation]': '' },
})
export class FriendListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public From: string;
  public To: string;


  IsOk = false;
}
