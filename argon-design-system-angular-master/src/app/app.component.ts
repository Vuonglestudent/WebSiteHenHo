import { UsersService } from "./shared/service/users.service";
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { AuthenticationService } from "./shared/service/authentication.service";
import { CallType, SignalRService } from "./shared/service/signal-r.service";
import { MessageService } from "./shared/service/message.service";
import {
  IUser,
  IUserInfo,
  Message,
  ChatFriend,
  UserDisplay,
} from "./models/models";
import { NotificationsService } from "angular2-notifications";
import { NotificationUserService } from "./shared/service/notification-user.service";
import { GeolocationService } from "@ng-web-apis/geolocation";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @ViewChild("openModal") modal: ElementRef<HTMLElement>;
  public caller: IUser;
  friendList: ChatFriend[] = new Array();
  CallType = CallType;
  userInfo: IUserInfo;
  connected: boolean;
  constructor(
    public router: Router,
    @Inject(DOCUMENT) private document: any,
    public location: Location,
    private authenticationService: AuthenticationService,
    public signalRService: SignalRService,
    private messageService: MessageService,
    private usersService: UsersService,
    private notificationService: NotificationsService,
    private notificationUserService: NotificationUserService,
    private readonly geolocationService: GeolocationService
  ) {
    this.signalRService.connectedObservable.subscribe((connected) => {
      this.connected = connected;

      if (this.connected) {
        this.authenticationService.userInfoObservable.subscribe((user) => {
          this.userInfo = user;

          if (this.userInfo != undefined) {
            this.getPosition();

            this.signalRService.saveMyInfo();

            this.loadFriendList();
          }
        });
      }
    });

    signalRService.callerObservable.subscribe((user) => {
      if (user == undefined || user == null) {
        return;
      }
      this.modal.nativeElement.click();
      console.log(user);
      this.caller = user;
    });

    this.signalRService.notificationObservable.subscribe((notification) => {
      if (notification != undefined) {
        this.notificationUserService.Notification.splice(0, 0, notification);
        this.showNotification(notification);
      }
    });

    this.messageService.friendListObservable.subscribe((data) => {
      if (data != undefined) {
        this.friendList = data;
      }
    });
  }

  loadFriendList() {
    this.messageService
      .GetFriendList(this.userInfo.id)
      .then((response) => {
        this.friendList = response;

        this.friendList.forEach((item) => {
          item.pageIndex = 1;
          item.isClicked = false;
        });

        this.messageService.setFriendList(this.friendList);
      })
      .catch((error) => {
        console.log("this is error");
        console.log(error);
      });
  }

  getLastName(fullName: string) {
    var n = fullName.split(" ");
    return n[n.length - 1];
  }

  ngOnInit() {
    this.signalRService.startConnection();

    this.signalRService.messageObservable.subscribe((response) => {
      if (response != undefined) {
        var message = new Message();
        message = response;

        if (message.senderId == this.userInfo.id) {
          message.type = "sent";
          console.log("sender");

          var userIndex = this.getUserIndex(message.receiverId);
          //Chưa có trong danh sách bạn.
          if (userIndex == -1) {
            this.usersService
              .GetDisplayUserById(message.receiverId)
              .then((response) => {
                console.log(response);
                var friend = new ChatFriend();
                friend.pageIndex = 1;
                friend.user = response;
                friend.messages = new Array<Message>();
                friend.messages.push(message);
                friend.isClicked = true;
                this.friendList.unshift(friend);
                this.messageService.setFriendList(this.friendList);
              })
              .catch((error) => {
                alert("Can not get display user");
              });
          } else {
            try {
              this.friendList[userIndex].messages.push(message);
              this.messageService.setFriendList(this.friendList);
            } catch {}
          }

          //Là người nhận
        } else if (message.receiverId == this.userInfo.id) {
          message.type = "received";
          console.log("receiver");
          this.pageUrl = this.router.url.split("/")[1];
          this.senderId = response.senderId;

          //Hiện thông báo
          if (this.pageUrl !== "chat" && this.pageUrl !== "friendlist") {
            this.showNotification(response);
          }

          var userIndex = this.getUserIndex(message.senderId);

          if (userIndex === -1) {
            this.usersService
              .GetDisplayUserById(message.senderId)
              .then((response) => {
                var friend = new ChatFriend();
                friend.pageIndex = 1;
                friend.user = response;
                friend.messages = new Array<Message>();
                friend.messages.push(message);
                friend.isClicked = true;

                this.friendList.unshift(friend);
                console.log(friend);
                this.messageService.setFriendList(this.friendList);
              })
              .catch((error) => {
                alert("Can not get display user");
              });
          } else {
            try {
              this.friendList[userIndex].messages.push(message);
              this.messageService.setFriendList(this.friendList);
            } catch {}
          }
        }
      }
    });
  }

  onClick() {
    console.log("clicked");
  }

  senderId = "";
  pageUrl: string = "";

  clickNotificationMes = (sendId) => {
    console.log("click", sendId);
    this.router.navigateByUrl("/chat");
  };

  getUserIndex = (userId: string) => {
    var index = -1;
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].user.id == userId) {
        return i;
      }
    }
    return index;
  };

  showNotification(message) {
    this.notificationService.html(
      `
    <div class="d-flex align-items-center" style="padding-bottom: 0%;">
      <img class="rounded-circle user_img_msg"
        src="${message.avatar}" alt="">
        <div class="col-12">
          <h5 style="margin-bottom: 0%;">${message.fullName}</h5>
          <p>${message.content}</p>
        </div>
    </div>`,
      null,
      {
        position: ["bottom", "right"],
        timeOut: 2000,
        clickToClose: false,
        theClass: "notification_mes",
        animate: "fade",
        showProgressBar: true,
      }
    );
  }

  onAccept() {
    this.caller.callType == CallType.VideoCall
      ? window.open("/#/call/0/true/" + this.caller.userId, "_blank")
      : window.open("/#/call/1/true/" + this.caller.userId, "_blank");
  }

  onDecline() {
    console.log("Decline a call");
    this.signalRService.callReject(this.caller.connectionId);
  }

  isSubscribe = false;

  getPosition() {
    this.geolocationService.subscribe(
      (position) => {
        if (!this.isSubscribe) {
          this.savePosition(
            position.coords.latitude,
            position.coords.longitude
          );
        }
        this.isSubscribe = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  savePosition(latitude: number, longitude: number) {
    this.usersService
      .SavePosition(this.userInfo.id, latitude, longitude)
      .subscribe(
        (data) => {},
        (err) => {
          console.log(err.error.message);
        }
      );
  }
}
