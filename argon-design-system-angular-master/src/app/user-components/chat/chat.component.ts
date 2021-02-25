import { UserDisplay, Message, ChatFriend } from '../../models/models';
import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SignalRService } from '../../service/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../signup/authentication.service';
import { MessageService } from '../../service/message.service';
import { UsersService } from '../../service/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  constructor(
    public signalRService: SignalRService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private usersService: UsersService,
    private router: Router,
  ) {

  }

  IsStarted = false;
  setScrollInterval

  public CurrentUserId = this.authenticationService.UserInfo.Id;
  public DestUserId = "";

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

    this.CurrentUserId = this.authenticationService.UserInfo.Id;
    this.messageService.friendList = new Array<ChatFriend>();
    this.messageService.GetFriendList(this.CurrentUserId)
      .then(response => {
        this.messageService.friendList = response;

        this.messageService.friendList.forEach(item => {
          item.pageIndex = 1;
        });
        //console.log('Trước khi more message');
        //console.log(this.messageService.friendList[0].messages);

        //this.MoreMessages(this.messageService.friendList[0].user.id, this.UserIndex);

        //console.log('SAU khi more message');
        console.log(this.messageService.friendList[0].messages);

        this.nameReceiver = this.messageService.friendList[0].user.fullName;
        this.hasAvatar = this.messageService.friendList[0].user.hasAvatar;
        this.avatarPath = this.messageService.friendList[0].user.avatarPath;

      })
      .catch(error => {
        console.log('this is error');
        console.log(error);
      });

  }
  time = 0
  ngAfterViewInit(): void {
    if (this.messageService.friendList.length > 0) {
      this.clickSendUser(this.messageService.friendList[0].user.id, this.messageService.friendList[0].user.fullName);
    }
    // this.timer = timer(1000, 1000)

    // this.timer.subscribe(val => {
    //   if (val % 2 == 0) {
    //     //console.log(val)
    //     clearInterval(this.setScrollInterval)
    //   }
    // })
  }


  sendMessage(): void {
    if (this.CurrentUserId == "" || this.DestUserId == "") {
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }

    if (this.txtMessage != '') {

      this.messageService.SendMessage(this.CurrentUserId, this.DestUserId, this.txtMessage)
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        });
      this.txtMessage = '';
      this.setScroll()
    }
  }

  setScroll = () => {
    var scroll = <HTMLElement>document.getElementById('contentMessage');
    // var shouldScroll = scroll.scrollTop + scroll.clientHeight === scroll.scrollHeight;
    // if (!shouldScroll) {

    setTimeout(() => scroll.scrollTop = scroll.scrollHeight, 500)
    //}
  }


  IsExist = (messageId: number, messages: Array<Message>) => {
    messages.forEach(element => {
      if (element.id == messageId) {
        return true;
      }
    });
    return false;
  }


  onScroll = () => {
    var scroll = <HTMLElement>document.getElementById('contentMessage')
    if (scroll.scrollTop === 0) {
      //this.MoreMessages(this.DestUserId, this.UserIndex)
    }
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
      console.log(destUserIdOld)
      destUserIdOld.setAttribute('class', 'd-flex bd-highlight')
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
    this.nameReceiver = nameUser
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
}
