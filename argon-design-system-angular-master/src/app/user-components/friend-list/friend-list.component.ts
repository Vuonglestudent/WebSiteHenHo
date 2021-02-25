import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { slideInOutAnimation } from '../../_animates/animates';
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
  onSubmit(f: NgForm) {
    if (f.value.From == "" || f.value.To == "") {
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }
    //this.CurrentUserId = f.value.From;
    //this.DestUserId = f.value.To;

    localStorage.setItem("CurrentUserId", f.value.From);
    localStorage.setItem("DestUserId", f.value.To);
    this.IsOk = true;
    alert("Ok let start chat!");
    //this.router.navigateByUrl('/chat');
  }


}
