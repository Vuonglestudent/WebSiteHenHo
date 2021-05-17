import { IUserInfo } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser, UserConnection } from 'src/app/models/models';
import { SignalRService } from 'src/app/service/signal-r.service';
import { AlertService } from 'src/app/_alert';
import { AuthenticationService } from '../../service/authentication.service';
import { faSpinner, faPhoneAlt, faMicrophone, faVideo } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {

  userId = '';
  isAccept;
  users: UserConnection[];

  joined = false;
  callerInfo: IUser;
  targetInfo: IUser;

  faPhoneAlt = faPhoneAlt;
  faMicrophone = faMicrophone;
  faVideo = faVideo;

  userInfo: IUserInfo = undefined;
  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public signalRService: SignalRService) {

    this.userId = this.route.snapshot.paramMap.get('id')?.toString() ?? "";
    this.isAccept = this.route.snapshot.paramMap.get('isAccept');

    this.authenticationService.userInfoObservable
      .subscribe(user => {
        if (user != undefined) {
          this.userInfo = user;
        }
      })

    this.signalRService.myInfoObservable
      .subscribe((data) => {

        if(data != undefined){
          if (this.isAccept == 'true') {

            this.onAcceptACall();
            console.log('accept a call')
          }
          else {
            this.onStartACall();
            console.log('start a call')
          }
        }
      })

    signalRService.usersObservable
      .subscribe(users => {
        if (users != undefined) {
          this.users = users;
          console.log('this is users:')
          console.log(this.users)
        }
        //this.onCheckTarget();
      });
  }

  ngOnInit() {

  }

  hangUp() {
    window.close();
  }

  onStartACall() {
    this.signalRService.join(this.userInfo.id, this.userInfo.fullName, true);
    this.joined = true;
  }

  onAcceptACall() {
    this.signalRService.getUserById(this.userId)
      .then(user => {
        this.signalRService.callerInfo = user;
        this.signalRService.join(this.userInfo.id, this.userInfo.fullName, false);
        this.joined = true;
      })
  }

  trackByFn(user: IUser) {
    return user.connectionId;
  }

}