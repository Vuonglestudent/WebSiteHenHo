import { IUserInfo } from './../../models/models';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser, UserConnection } from 'src/app/models/models';
import { SignalRService } from 'src/app/service/signal-r.service';
import { AlertService } from 'src/app/_alert';
import { AuthenticationService } from '../../service/authentication.service';

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

  userInfo:IUserInfo;
  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public signalRService: SignalRService) {

    this.userId = this.route.snapshot.paramMap.get('id')?.toString() ?? "";
    this.isAccept = this.route.snapshot.paramMap.get('isAccept');
    console.log(this.route.snapshot.params)
    console.log(this.isAccept)
    console.log('this is userId:' + this.userId);

    this.authenticationService.userInfoObservable
	    .subscribe(user => this.userInfo = user)

    signalRService.connectedObservable
      .subscribe(isConnected =>{
        if (isConnected && this.userInfo != undefined) {
          this.signalRService.getMyInfo()
            .then(data => {
              if(this.isAccept == 'true'){
      
                this.onAcceptACall();
                console.log('accept a call')
              }
              else{
                this.onStartACall();
                console.log('start a call')
              }
            })
            .catch(err => console.log(err))
        }
      })

    signalRService.usersObservable
      .subscribe(users => {
        this.users = users;
        console.log('this is users:')
        console.log(this.users)
        //this.onCheckTarget();
      });

      // signalRService.callerObservable
      // .subscribe(user => {
      //   console.log('this is caller Info:');
      //   console.log(user);
      //   this.callerInfo = user;
      // })

  }

  ngOnInit() {

  }

  hangUp(){
    this.users.forEach(element => {
      element.end();
    });
  }

  onStartACall() {
    this.signalRService.join(this.userInfo.id, this.userInfo.fullName, true);
    this.joined = true;
  }

  onAcceptACall() {
    this.signalRService.getUserById(this.userId)
      .then(user =>{
        this.signalRService.callerInfo = user;
        this.signalRService.join(this.userInfo.id, this.userInfo.fullName, false);
        this.joined = true;
      })
  }

  trackByFn(user: IUser) {
    return user.connectionId;
  }

  onCheckTarget() {
    this.signalRService.getTargetInfo(this.userId)
      .then(data =>{
        console.log(data);
        if(data == null){
          this.alertService.clear();
          this.alertService.error("Target is not online");
          return;
        }
        // target is online
      })
      .catch(err => {
        console.log(err);
        this.alertService.clear();
        this.alertService.error("Target is not online");
      })
  }
}