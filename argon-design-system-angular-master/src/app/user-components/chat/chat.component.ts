import { Message, ChatFriend, IUserInfo } from '../../models/models';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { SignalRService } from '../../service/signal-r.service';
import { AuthenticationService } from '../../service/authentication.service';
import { MessageService } from '../../service/message.service';
import { faVideo, faEllipsisV, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { AlertService } from 'src/app/_alert';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  userInfo:IUserInfo;
  public CurrentUserId = ""
  public DestUserId = "";
  
  constructor(
    public signalRService: SignalRService,
    private authenticationService: AuthenticationService,
    public messageService: MessageService,
    private alertService: AlertService
  ) {
    this.authenticationService.userInfoObservable
      .subscribe(user => {
        this.userInfo = user;
        this.CurrentUserId = this.userInfo.id;
      })
  }
  faEllipsisV = faEllipsisV;
  faVideo = faVideo;
  faPhoneAlt = faPhoneAlt;

  IsStarted = false;
  setScrollInterval

  public PageSize = 20;
  public From: string;
  public To: string;
  public UserIndex = 0;

  SenderId: string;
  ReceiverId: string;
  txtMessage: string = '';

  nameReceiver = '';
  hasAvatar: boolean;
  avatarPath: string;
  timer;

  ngOnInit(): void {
    this.CurrentUserId = this.userInfo.id;
    this.messageService.friendList = new Array<ChatFriend>();
    this.messageService.GetFriendList(this.CurrentUserId)
      .then(response => {
        this.messageService.friendList = response;

        this.messageService.friendList.forEach(item => {
          item.pageIndex = 1;
        });

        try {
          this.MoreMessages(this.messageService.friendList[0].user.id, this.UserIndex);
        } catch (error) {
          
        }

        this.nameReceiver = this.messageService.friendList[0].user.fullName;
        this.hasAvatar = this.messageService.friendList[0].user.hasAvatar;
        this.avatarPath = this.messageService.friendList[0].user.avatarPath;
        this.ReceiverId = this.messageService.friendList[0].user.id;
      })
      .catch(error => {
        console.log('this is error');
        console.log(error);
      });

  }
  time = 0
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.clickSendUser(this.messageService.friendList[0].user.id, this.messageService.friendList[0].user.fullName);
    }, 500);
  }


  sendMessage(): void {
    if (this.CurrentUserId == "" || this.DestUserId == "") {
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }

    if (this.txtMessage != '') {

      this.messageService.SendMessage(this.CurrentUserId, this.DestUserId, this.txtMessage)
        .then(data => {
          this.setScroll();
        })
        .catch(error => {
          console.log(error)
        });
      this.txtMessage = '';
      
    }
  }

  setScroll = () => {
    var scroll = <HTMLElement>document.getElementById('contentMessage');
    scroll.scrollTop = scroll.scrollHeight;
    setTimeout(() => scroll.scrollTop = scroll.scrollHeight, 10);
  }


  IsExist = (messageId: number, messages: Array<Message>) => {
    var message = messages.filter(x=>x.id === messageId);
    return message.length == 0 ? false : true;
  }

  MoreMessages = (userId: string, userIndex: number) => {
    this.messageService.moreMessages(this.messageService.friendList[userIndex].pageIndex, this.PageSize, this.CurrentUserId, userId)
      .then(data => {
        this.messageService.friendList[userIndex].pageIndex += 1;
        data.forEach(element => {
          if (!this.IsExist(element.id, this.messageService.friendList[userIndex].messages)) {
            //
            this.messageService.friendList[userIndex].messages.splice(0, 0, element);
          }
        });
      })
      .catch(error => {
      })
  }

  clickSendUser = (idUser, nameUser) => {
    var destUserIdOld = <HTMLElement>document.getElementById(`DestUserId_${localStorage.getItem('DestUserId')}`);
    if (destUserIdOld != null) {
      //console.log(destUserIdOld)
      destUserIdOld.setAttribute('class', 'd-flex bd-highlight')
      this.setScroll();
    }

    this.DestUserId = idUser;
    var destUserId = <HTMLElement>document.getElementById(`DestUserId_${idUser}`);
    var userIndex = this.getUserIndex(idUser);
    if (userIndex != -1) {
      this.UserIndex = userIndex;
      this.messageService.friendList[userIndex].pageIndex = 1;

      if (this.messageService.friendList[userIndex].messages.length <= 1) {
        this.messageService.friendList[userIndex].messages = new Array<Message>();
        this.MoreMessages(idUser, this.UserIndex);
      }
    }
    destUserId.setAttribute('class', 'd-flex bd-highlight active')
    localStorage.setItem('DestUserId', idUser)
    this.nameReceiver = nameUser;
    this.ReceiverId = this.messageService.friendList[userIndex].user.id;
    this.avatarPath = this.messageService.friendList[userIndex].user.avatarPath;
    this.hasAvatar = this.messageService.friendList[userIndex].user.hasAvatar;
    this.setScroll()
  }

  breakRow = (e) => {
    var message = e.target
    this.txtMessage = this.txtMessage + "\n"
    message.setAttribute('value', `${this.txtMessage}`)
  }

  getUserIndex = (userId: string) => {
    var index = -1;
    for (let i = 0; i < this.messageService.friendList.length; i++) {
      if (this.messageService.friendList[i].user.id == userId) {
        return i;
      }
    }
  }

  isUserExist(userId: string) {
    this.messageService.friendList.forEach(element => {
      if (element.user.id == userId) {
        return true;
      }
    });

    return false;
  }


  onVideoCall(){
    console.log(this.ReceiverId);
    this.onCheckTarget();
  }
  openCallVideoTab(receiverId: string) {  
    window.open('/#/video-call/false/' + receiverId, '_blank');
  }

  onCheckTarget() {
    this.signalRService.getTargetInfo(this.ReceiverId)
      .then(data =>{
        if(data == null){
          this.alertService.clear();
          this.alertService.error("Target is not online");
          return;
        }
        // target is online
        this.openCallVideoTab(this.ReceiverId);
      })
      .catch(err => {
        console.log(err);
        this.alertService.clear();
        this.alertService.error("Target is not online");
      })
  }
}
