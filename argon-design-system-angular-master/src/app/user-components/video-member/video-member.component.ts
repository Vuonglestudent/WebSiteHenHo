import { AuthenticationService } from './../../service/authentication.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UserConnection } from 'src/app/models/models';


@Component({
  selector: 'app-video-member',
  templateUrl: './video-member.component.html',
  styleUrls: ['./video-member.component.css']
})
export class VideoMemberComponent implements OnInit {
  @Input()
  user: UserConnection;
  
  @Input()
  className:string = '';

  theVideo: HTMLVideoElement;
  @ViewChild('theVideo')
  set mainLocalVideo(el: ElementRef) {
    this.theVideo = el.nativeElement;
    this.theVideo.classList.add(this.className);
  }

  

  constructor(
    private authenticationService:AuthenticationService
  ) { }

  ngOnInit() {
    this.user.streamObservable.subscribe(stream => {

      if (stream) {
        if (this.user.user.userId == this.authenticationService.UserInfo.Id) {
          this.theVideo.srcObject = stream;
          this.theVideo.defaultMuted = true;
          this.theVideo.volume = 0;
          this.theVideo.muted = true;
        } else {
          this.theVideo.srcObject = stream;
        }
      }
      else {
        console.log('No stream');
      }
    });
  }
}
  