import { CallService } from './call.service';
import { IUserInfo } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser, UserConnection } from 'src/app/models/models';
import { CallType, SignalRService } from 'src/app/shared/service/signal-r.service';
import { AlertService } from 'src/app/shared/_alert';
import { AuthenticationService } from '../../shared/service/authentication.service';
import { faSpinner, faPhoneAlt, faMicrophone, faVideo } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {

  userId = '';
  isAccept;

  CallType = CallType;
  localConnection: UserConnection;
  partnerConnection: UserConnection;

  joined = false;
  callerInfo: IUser;
  targetInfo: IUser;

  faPhoneAlt = faPhoneAlt;
  faMicrophone = faMicrophone;
  faVideo = faVideo;

  userInfo: IUserInfo = undefined;

  public currentMediaStream: MediaStream;
  callType: CallType = CallType.VoiceCall;

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public signalRService: SignalRService,
  ) {

    this.userId = this.route.snapshot.paramMap.get('id')?.toString() ?? "";
    this.isAccept = this.route.snapshot.paramMap.get('isAccept');
    this.callType = Number(this.route.snapshot.paramMap.get('callType'));

    this.authenticationService.userInfoObservable
      .subscribe(user => {
        if (user != undefined) {
          this.userInfo = user;
        }
      })

    this.signalRService.myInfoObservable
      .subscribe((data) => {

        if (data != undefined) {
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

    signalRService.localConnectionObservable
      .subscribe(data => {
        
        if (data != undefined) {
          console.log('Nhan duoc local connection:')
          console.log(data);
          this.localConnection = data;
        }
      })

    signalRService.partnerConnectionObservable
      .subscribe(data => {
        if (data != undefined) {
          console.log('Nhan duoc partner connection:');
          console.log(data);
          this.partnerConnection = data;
        }
      })
  }

  ngOnInit() {
    this.timeCount();
  }

  hangUp() {
    window.close();
  }

  onStartACall() {
    this.signalRService.join(this.userInfo.id, this.userInfo.fullName, this.userInfo.avatarPath, true, this.callType);
    this.joined = true;
  }

  onAcceptACall() {
    this.signalRService.getUserById(this.userId)
      .then(user => {
        this.signalRService.callerInfo = user;
        this.signalRService.join(this.userInfo.id, this.userInfo.fullName, this.userInfo.avatarPath, false, this.callType);
        this.joined = true;
      })
  }

  trackByFn(user: IUser) {
    return user.connectionId;
  }

  toggleAudio() {
    console.log('click toggleAudio');
  }

  toggleVideo() {
    console.log('click toggleVideo');
  }




  totalTime = 0;
  time: string;
  interval;

  timeCount() {
    var h = 0;
    var m = 0;
    var s = 0;

    var hour = '0';
    var minute = '0';
    var second = '0';

    this.interval = setInterval(() => {
      this.totalTime++;

      var tmp = this.totalTime % 3600;
      h = (this.totalTime - tmp) / 3600;
      tmp = (this.totalTime - h * 3600) % 60;
      m = (this.totalTime - h * 3600 - tmp) / 60;
      s = this.totalTime - (h * 3600 + m * 60);

      hour = h < 10 ? '0' + h : h.toString();
      minute = m < 10 ? '0' + m : m.toString();
      second = s < 10 ? '0' + s : s.toString();

      this.time = hour + ' : ' + minute + ' : ' + second;
    }, 1000)
  }
}