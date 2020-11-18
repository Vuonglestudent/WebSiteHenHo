import { UserDisplay, Message, ChatFriend } from './../Models/Models';
import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SignalRService } from '../service/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../signup/authentication.service';
import { MessageService } from '../service/message.service';
import { UsersService } from '../service/users.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.paramMap.subscribe(params => {
      this.ngOnInit();
    });
  }

  IsStarted = false;

  public CurrentUserId = this.authenticationService.UserInfo.Id;
  public DestUserId = "";

  public PageSize = 20;
  public From: string;
  public To: string;
  public UserIndex = 0;

  SenderId: string;
  ReceiverId: string;
  txtMessage: string = '';
  messages = new Array<Message>();
  message = new Message();

  nameReceiver = '';
  hasAvatar: boolean;
  avatarPath: string;

  newFriendId;
  ngOnInit(): void {
    this.newFriendId = this.route.snapshot.paramMap.get('id');
    console.log('day la id')
    console.log(this.newFriendId)
    if(this.isUserExist(this.newFriendId)){
      this.newFriendId = null;
    }
    this.CurrentUserId = this.authenticationService.UserInfo.Id;

    this.messageService.GetFriendList(this.CurrentUserId)
      .then(response => {
        this.messageService.friendList = response;

        this.messageService.friendList.forEach(item => {
          item.pageIndex = 1;
        });

        this.messages = new Array<Message>();
        this.MoreMessages(this.messageService.friendList[0].user.id, this.UserIndex);

        if(this.newFriendId != null){
          
          if(!this.isUserExist(this.newFriendId)){
            this.usersService.GetById(this.newFriendId)
            .then(data => {
              var friend = new ChatFriend();
              friend.messages = new Array<Message>();
              friend.user = data;
              friend.pageIndex = 1;
              this.messageService.friendList.splice(0, 0, friend);
              this.nameReceiver = this.messageService.friendList[0].user.fullName;
              this.hasAvatar = this.messageService.friendList[0].user.hasAvatar;
              this.avatarPath = this.messageService.friendList[0].user.avatarPath;
            })
            .catch(error => {console.log('không lấy được user info')})
          }
          else{
            this.nameReceiver = this.messageService.friendList[0].user.fullName;
            this.hasAvatar = this.messageService.friendList[0].user.hasAvatar;
            this.avatarPath = this.messageService.friendList[0].user.avatarPath;
          }

        }
        else{
          this.nameReceiver = this.messageService.friendList[0].user.fullName;
          this.hasAvatar = this.messageService.friendList[0].user.hasAvatar;
          this.avatarPath = this.messageService.friendList[0].user.avatarPath;
        }

      })
      .catch(error => {
        console.log('this is error');
        console.log(error);
      });


  }
  ngAfterViewInit(): void {
    
    this.setScroll()
    if(this.messageService.friendList.length > 0){
      this.clickSendUser(this.messageService.friendList[0].user.id, this.messageService.friendList[0].user.fullName);
    }
  }


  sendMessage(): void {
    if (this.CurrentUserId == "" || this.DestUserId == "") {
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }

    if (this.txtMessage != '') {
      this.message = new Message();
      this.messages.push(this.message);

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
    console.log(scroll.scrollHeight)
    scroll.scrollTop = scroll.scrollHeight
  }


  IsExist = (messageId: number) => {
    this.messages.forEach(element => {
      if (element.id == messageId) {
        return false;
      }
    });
    return true;
  }



  onScroll = () => {
    var scroll = <HTMLElement>document.getElementById('contentMessage')
    if (scroll.scrollTop === 0) {
      this.MoreMessages(this.DestUserId, this.UserIndex)
    }
  }
  MoreMessages = (userId: string, userIndex: number) => {
    this.messageService.moreMessages(this.messageService.friendList[userIndex].pageIndex, this.PageSize, this.CurrentUserId, userId)
      .then(data => {
        //console.log(data);
        this.messageService.friendList[userIndex].pageIndex += 1;
        this.messages = new Array<Message>();
        data.forEach(element => {
          if (this.IsExist(element.id)) {
            //
            var message = new Message();
            message = element;

            this.messages.splice(0, 0, message);
          }
        });
        this.messageService.friendList[userIndex].messages = this.messages.concat(this.messageService.friendList[userIndex].messages);
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
    console.log(idUser);
    this.DestUserId = idUser;
    var destUserId = <HTMLElement>document.getElementById(`DestUserId_${idUser}`);
    var userIndex = this.getUserIndex(idUser);
    this.UserIndex = userIndex;
    this.MoreMessages(idUser, this.UserIndex);
    destUserId.setAttribute('class', 'd-flex bd-highlight active')
    localStorage.setItem('DestUserId', idUser)
    this.nameReceiver = nameUser

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

  isUserExist(userId: string){
    this.messageService.friendList.forEach(element => {
        if(element.user.id == userId){
          return true;
        }
    });

    return false;
  }
}
