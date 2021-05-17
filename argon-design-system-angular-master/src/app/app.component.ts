import { Component, OnInit, Inject, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Location } from '@angular/common';
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
  public caller: IUser;

  userInfo: IUserInfo;
  connected: boolean;
  constructor(
    public router: Router, @Inject(DOCUMENT,) private document: any,
    public location: Location,
    private authenticationService: AuthenticationService,
    public signalRService: SignalRService,
    private messageService: MessageService,
    private _ngZone: NgZone,
    private notificationService: NotificationsService,
    private notificationUserService: NotificationUserService,
  ) {
    this.signalRService.connectedObservable
      .subscribe(connected => {
        this.connected = connected;

        if (this.connected) {
          this.authenticationService.userInfoObservable
            .subscribe(user => {
              this.userInfo = user;

              if (this.userInfo != undefined) {
                this.signalRService.getMyInfo()
                  .then(data => {
                  })
                  .catch(err => console.log(err))
              }
            })
        }

      })

    signalRService.callerObservable
      .subscribe(user => {
        if (user == undefined || user == null) {
          return;
        }
        this.modal.nativeElement.click();
        console.log(user);
        this.caller = user;
      })


    this.signalRService.notificationObservable
      .subscribe(notification => {
        if (notification != undefined) {
          this.notificationUserService.Notification.splice(0, 0, notification);
          this.showNotification(notification);
        }
      })
  }


  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.messageObservable
      .subscribe(response => {
        if (response != undefined) {
          var message = new Message();
          message = response;

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
            this.pageUrl = this.router.url.split("/")[1];
            this.senderId = response.senderId

            //Hiện thông báo
            if (this.pageUrl !== "chat" && this.pageUrl !== "friendlist") {
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

  }

  onClick() {
    console.log('clicked')
  }

  senderId = ''
  pageUrl: string = '';

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

  onDecline() {
    console.log('Decline a call');
  }
}
