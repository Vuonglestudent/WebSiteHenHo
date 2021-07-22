import { UserDisplay } from "./../../models/models";
import { fromEvent, Subject } from "rxjs";
import { UsersService } from "./../../shared/service/users.service";
import { Message, ChatFriend, IUserInfo, User } from "../../models/models";
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  CallType,
  SignalRService,
} from "../../shared/service/signal-r.service";
import { AuthenticationService } from "../../shared/service/authentication.service";
import { MessageService } from "../../shared/service/message.service";
import {
  faVideo,
  faEllipsisV,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import { AlertService } from "src/app/shared/_alert";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { slideInOutAnimation } from "src/app/shared/_animates/animates";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
  animations: [slideInOutAnimation],
})
export class ChatComponent implements OnInit, AfterViewInit {
  userInfo: IUserInfo;
  public CurrentUserId = "";
  public DestUserId = "";

  @ViewChild("searchBox", { static: true }) searchBox: ElementRef | undefined;
  @ViewChild("searchButton", { static: true }) searchButton:
    | ElementRef
    | undefined;

  friendList: ChatFriend[] = new Array();

  constructor(
    public signalRService: SignalRService,
    private authenticationService: AuthenticationService,
    public messageService: MessageService,
    private alertService: AlertService,
    private usersService: UsersService
  ) {
    this.authenticationService.userInfoObservable.subscribe((user) => {
      this.userInfo = user;
      if (this.userInfo != undefined) {
        this.CurrentUserId = this.userInfo.id;
      }
    });

    this.messageService.friendListObservable.subscribe((data) => {
      if (data != undefined) {
        this.friendList = data;
        if (this.friendList.length != 0 && !this.isLoaded) {
          this.MoreMessages(this.friendList[0].user.id, this.UserIndex);
          this.nameReceiver = this.friendList[0].user.fullName;
          this.avatarPath = this.friendList[0].user.avatarPath;
          this.ReceiverId = this.friendList[0].user.id;

          this.isLoaded = true;
        }
      }
    });
  }
  isLoaded = false;

  faEllipsisV = faEllipsisV;
  faVideo = faVideo;
  faPhoneAlt = faPhoneAlt;

  public PageSize = 20;
  public From: string;
  public To: string;
  public UserIndex = 0;

  ReceiverId: string;
  txtMessage: string = "";

  nameReceiver = "";
  avatarPath: string = "";

  ngOnInit(): void {
    fromEvent(this.searchBox?.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.onSearch(text);
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.friendList.length == 0) {
        return;
      }

      this.clickSendUser(
        this.friendList[0].user.id,
        this.friendList[0].user.fullName
      );
    }, 500);
  }

  sendMessage(): void {
    if (this.CurrentUserId == "" || this.DestUserId == "") {
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }
    this.txtMessage = this.txtMessage.substring(0, this.txtMessage.length - 1);
    console.log(this.txtMessage.length);
    if (this.txtMessage.length > 0) {
      this.messageService
        .SendMessage(
          this.CurrentUserId,
          this.DestUserId,
          this.txtMessage,
          undefined
        )
        .then((data) => {
          this.setScroll();
        })
        .catch((error) => {
          console.log(error);
        });
      this.txtMessage = "";
    }
  }

  setScroll = () => {
    var scroll = <HTMLElement>document.getElementById("contentMessage");
    scroll.scrollTop = scroll.scrollHeight;
    setTimeout(() => (scroll.scrollTop = scroll.scrollHeight), 10);
  };

  IsExist = (messageId: number, messages: Array<Message>) => {
    var message = messages.filter((x) => x.id === messageId);
    return message.length == 0 ? false : true;
  };

  MoreMessages = (userId: string, userIndex: number) => {
    this.messageService
      .moreMessages(
        this.friendList[userIndex].pageIndex,
        this.PageSize,
        this.CurrentUserId,
        userId
      )
      .then((data) => {
        console.log(data);
        this.friendList[userIndex].pageIndex += 1;
        data.forEach((element) => {
          if (!this.IsExist(element.id, this.friendList[userIndex].messages)) {
            //
            this.friendList[userIndex].messages.splice(0, 0, element);
          }
        });
      })
      .catch((error) => {});
  };
  chat = false;

  clickSendUser = (idUser, nameUser) => {
    this.chat = false;
    console.log(this.chat);
    var destUserIdOld = <HTMLElement>(
      document.getElementById(
        `DestUserId_${localStorage.getItem("DestUserId")}`
      )
    );
    if (destUserIdOld != null) {
      destUserIdOld.setAttribute("class", "d-flex bd-highlight");
      this.setScroll();
    }

    this.DestUserId = idUser;
    var destUserId = <HTMLElement>(
      document.getElementById(`DestUserId_${idUser}`)
    );
    var userIndex = this.getUserIndex(idUser);
    if (userIndex != -1) {
      this.UserIndex = userIndex;
      this.friendList[userIndex].pageIndex = 1;

      if (
        this.friendList[userIndex].messages.length <= 1 &&
        !this.friendList[userIndex].isClicked
      ) {
        this.friendList[userIndex].messages = new Array<Message>();
        this.MoreMessages(idUser, this.UserIndex);
        this.friendList[userIndex].isClicked = true;
      }
    }
    destUserId.setAttribute("class", "d-flex bd-highlight active");
    localStorage.setItem("DestUserId", idUser);
    this.nameReceiver = nameUser;
    this.ReceiverId = this.friendList[userIndex].user.id;
    this.avatarPath = this.friendList[userIndex].user.avatarPath;
    this.setScroll();
  };

  getUserIndex = (userId: string) => {
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].user.id == userId) {
        return i;
      }
    }
    return -1;
  };

  isUserExist(userId: string) {
    this.friendList.forEach((element) => {
      if (element.user.id == userId) {
        return true;
      }
    });

    return false;
  }

  onVideoCall() {
    this.onCheckTarget(CallType.VideoCall);
  }

  onVoiceCall() {
    this.onCheckTarget(CallType.VoiceCall);
  }

  openCallVideoTab(receiverId: string, callType: CallType) {
    window.open("/#/call/" + callType + "/false/" + receiverId, "_blank");
  }

  onCheckTarget(callType) {
    this.signalRService
      .getUserById(this.ReceiverId)
      .then((data) => {
        if (data == null) {
          this.alertService.clear();
          this.alertService.warn("Người dùng không online, hãy gọi lại sau");
          return;
        }
        // target is online
        this.openCallVideoTab(data.userId, callType);
      })
      .catch((err) => {
        console.log(err);
        this.alertService.clear();
        this.alertService.warn("Người dùng không online, hãy gọi lại sau");
      });
  }
  options = {
    autoClose: true,
    keepAfterRouteChange: false,
  };
  users: User[] = new Array();
  onSearch(name: string) {
    this.usersService.SearchFriendByName(name).subscribe(
      (data) => {
        this.users = data;
      },
      (err) => {
        this.alertService.warn("Không tìm thấy người dùng nào", this.options);
      }
    );
  }

  onChatToNewUser(user: UserDisplay) {
    var u = this.friendList.filter((x) => x.user.id == user.id);
    if (u.length === 0) {
      var friend = new ChatFriend();
      friend.pageIndex = 1;
      friend.user = user;
      friend.messages = new Array();
      friend.isClicked = true;

      this.friendList.unshift(friend);
    }
    setTimeout(() => {
      this.clickSendUser(user.id, user.fullName);
    }, 5);
  }

  iconEvent(event: any) {
    this.txtMessage += event;
  }

  onSendImage(files: File[]) {
    console.log(files);
    this.messageService
      .SendMessage(this.CurrentUserId, this.DestUserId, "file", files)
      .then((data) => {
        this.setScroll();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
