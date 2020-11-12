import { UserDisplay, Message, ChatFriend } from './../Models/Models';
import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SignalRService } from '../service/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../signup/authentication.service';
import { MessageService } from '../service/message.service';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  constructor(
    public signalRService: SignalRService,
    private http: HttpClient,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private usersService: UsersService,
  ) {
    this.subscribeToEvents();
  }

  IsStarted = false;

  public CurrentUserId = '';
  public DestUserId = "";
  public PageIndex = 1;
  public MessageIndex = 1;
  public PageSize = 20;
  public From: string;
  public To: string;
  public UserIndex = 0;

  SenderId: string;
  ReceiverId: string;
  txtMessage: string = '';
  messages = new Array<Message>();
  message = new Message();
  friendList = new Array<ChatFriend>();
  nameReceiver = '';


  ngOnInit(): void {

    this.CurrentUserId = this.authenticationService.UserInfo.Id;

    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();

    this.messageService.GetFriendList(this.CurrentUserId)
      .then(response => {
        this.friendList = response;
        console.log('this is friend list')
        console.log(this.friendList);
        this.PageIndex = 1;
        this.messages = new Array<Message>();
        this.MoreMessages(this.friendList[0].user.id, this.UserIndex);
        this.nameReceiver = this.friendList[0].user.fullName;
      })
      .catch(error => {
        console.log('this is error');
        console.log(error);
      });
  }
  ngAfterViewInit(): void {
    this.setScroll()
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

  subscribeToEvents = () => {
    this.signalRService.messageReceived.subscribe((response: any) => {
      this._ngZone.run(() => {
        console.log('this is res');
        console.log(response);
        var message = new Message();
        message = response;
        if (message.senderId == this.CurrentUserId) {
          message.type = 'sent';
          console.log('sender');
          var userIndex = this.getUserIndex(message.receiverId);
          if (userIndex == -1) {
            var newUser = new UserDisplay();
            this.usersService.GetDisplayUser(message.receiverId)
              .then(response => {
                newUser = response;
              })
              .catch(error => {
                alert("Can not get display user");
                return;
              })
          }
          this.friendList[this.UserIndex].messages.push(message);
        } else if (message.receiverId == this.CurrentUserId) {
          message.type = 'received';
          console.log('receiver');
          this.friendList[this.UserIndex].messages.push(message);
        } else {
          console.log("nothing!");
        }
      })
    })
  }

  onSubmit(f: NgForm) {
    if (f.value.From == "" || f.value.To == "") {
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }
    this.CurrentUserId = f.value.From;
    this.DestUserId = f.value.To;
    alert("Ok let start chat!");
  }

  IsExist = (messageId: number) => {
    this.messages.forEach(element => {
      if (element.id == messageId) {
        return false;
      }
    });
    return true;
  }

  getUserIndex = (userId: string) => {
    var index = -1;
    for (let i = 0; i < this.friendList.length; i++) {
      if (this.friendList[i].user.id == userId) {
        return i;
      }
    }
  }

  onScroll = () => {
    var scroll = <HTMLElement>document.getElementById('contentMessage')
    if (scroll.scrollTop === 0) {
      this.MoreMessages(this.DestUserId, this.UserIndex)
    }
  }
  MoreMessages = (userId: string, userIndex: number) => {
    this.messageService.moreMessages(this.MessageIndex, this.PageSize, this.CurrentUserId, userId)
      .then(data => {
        //console.log(data);
        this.MessageIndex += 1;
        this.messages = new Array<Message>();
        data.forEach(element => {
          if (this.IsExist(element.id)) {
            //
            var message = new Message();
            message = element;

            this.messages.splice(0, 0, message);
          }
        });
        this.friendList[userIndex].messages = this.messages.concat(this.friendList[userIndex].messages) ;
        console.log(this.friendList[userIndex].messages)
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

    this.MessageIndex = 1;
  }

  breakRow = (e) => {
    var message = e.target
    this.txtMessage = this.txtMessage + "\n"
    message.setAttribute('value', `${this.txtMessage}`)
  }

  convertMessage = (msg) => {
    console.log(msg);
  }

}
