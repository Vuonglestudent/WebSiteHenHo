import { Component, OnInit, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import 'rxjs/add/operator/filter';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from './service/authentication.service';
import { SignalRService } from './service/signal-r.service';
import { MessageService } from './service/message.service';
import { IUser, IUserInfo, Message } from './models/models';
import { NotificationsService } from 'angular2-notifications';
import { NotificationUserService } from './service/notification-user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('openModal') modal: ElementRef<HTMLElement>;
  private caller: IUser;

  userInfo:IUserInfo;
  constructor(
    private router: Router, @Inject(DOCUMENT,) private document: any,
    public location: Location,
    private authenticationService: AuthenticationService,
    public signalRService: SignalRService,
    private messageService: MessageService,
    private _ngZone: NgZone,
    private notificationService: NotificationsService,
    private notificationUserService: NotificationUserService,
  ) {
    this.subscribeToEvents();
    this.signalRService.connectedObservable
      .subscribe(connected => {
        if (connected && this.userInfo != undefined) {
          this.signalRService.getMyInfo()
            .then(data => {
              console.log('this is my data');
              console.log(data)
            })
            .catch(err => console.log(err))
        }
      })

    signalRService.callerObservable
      .subscribe(user => {
        console.log('this is caller Info:');
        if (user == undefined || user == null) {
          console.log('null or undefined')
          return;
        }
        this.modal.nativeElement.click();
        console.log(user);
        this.caller = user;
      })

      this.authenticationService.userInfoObservable
	      .subscribe(user => this.userInfo = user)

  }

  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
  }

  onClick() {
    console.log('clicked')
  }

  senderId = ''
  subscribeToEvents = () => {
    this.signalRService.messageReceived.subscribe((response: any) => {
      this._ngZone.run(() => {
        var message = new Message();
        message = response;

        if (message.type == "onlineCount") {
          //console.log('Number of online users: ' + message.onlineCount)
          this.messageService.onlineCount = message.onlineCount;
        }
        else if (message.type == "notification") {
          if (checkUrl !== "chat" && checkUrl !== "friendlist") {
            this.notificationUserService.Notification.splice(0, 0, message);
            this.showNotification(response);
          }
        }
        else {
          //Là người gửi
          if (message.senderId == this.userInfo.id) {
            message.type = 'sent';
            console.log('sender');

            var userIndex = this.getUserIndex(message.receiverId);
            //Chưa có trong danh sách bạn.
            if (userIndex == -1) {
              // var newUser = new UserDisplay();
              // this.usersService.GetDisplayUser(message.receiverId)
              //   .then(response => {
              //     newUser = response;
              //     var friend = new ChatFriend();
              //     friend.user = new UserDisplay();
              //     friend.messages = new Array<Message>();
              //     friend.messages.push(message);

              //   })
              //   .catch(error => {
              //     alert("Can not get display user");
              //   })
            }
            else {
              try {
                this.messageService.friendList[userIndex].messages.push(message);
              }
              catch { }
            }

            //Là người nhận
          } else if (message.receiverId == this.userInfo.id) {
            message.type = 'received';
            console.log('receiver');
            var checkUrl = this.router.url.split("/")[1]
            console.log(checkUrl)
            this.senderId = response.senderId

            //Hiện thông báo
            if (checkUrl !== "chat" && checkUrl !== "friendlist") {
              this.showNotification(response);
            }


            var userIndex = this.getUserIndex(message.senderId);

            if (userIndex == -1) {
              // var newUser = new UserDisplay();
              // this.usersService.GetDisplayUser(message.receiverId)
              //   .then(response => {
              //     newUser = response;
              //     var friend = new ChatFriend();
              //     friend.user = new UserDisplay();
              //     friend.messages = new Array<Message>();
              //     friend.messages.push(message);

              //   })
              //   .catch(error => {
              //     alert("Can not get display user");
              //   })
            }
            else {
              try {
                this.messageService.friendList[userIndex].messages.push(message);
              }
              catch { }
            }
          }
        }

      })
    })
  }

  clickNotificationMes = (sendId) => {
    console.log("click", sendId)
    this.router.navigateByUrl('/friendlist');
  }

  getUserIndex = (userId: string) => {
    var index = -1;
    for (let i = 0; i < this.messageService.friendList.length; i++) {
      if (this.messageService.friendList[i].user.id == userId) {
        return i;
      }
    }
  }

  showNotification(message) {
    this.notificationService.html(`
    <div class="d-flex align-items-center" style="padding-bottom: 0%;">
      <img class="rounded-circle user_img_msg"
        src="${message.avatar}" alt="">
        <div class="col-12">
          <h5 style="margin-bottom: 0%;">${message.fullName}</h5>
          <p>${message.content}</p>
        </div>
    </div>`, null, {
      position: ['bottom', 'right'],
      timeOut: 2000,
      clickToClose: false,
      theClass: 'notification_mes',
      animate: 'fade',
      showProgressBar: true,
    });
  }

  onAccept() {
    window.open('/#/video-call/true/' + this.caller.userId, '_blank');
  }

  onDecline(){
    console.log('Decline a call');
  }
}
