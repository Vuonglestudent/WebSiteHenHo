import { UserDisplay } from './../Models/Models';
import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SignalRService } from '../service/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { Message, ChatFriend } from '../Models/Models';
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

  public CurrentUserId = 'EC826AF8-0310-48CF-8A14-DA11BDB1C96D';

  public DestUserId = "EC826AF8-0310-48CF-8A14-DA11BDB1C96E";
  public PageIndex = 1;
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
      })
      .catch(error => {
        console.log('this is error');
        console.log(error);
      });
  }
  ngAfterViewInit(): void {

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
    }
  }

  subscribeToEvents = () => {
    this.signalRService.messageReceived.subscribe((response: any) => {
      this._ngZone.run(() => {
        console.log('Nhận tin nhắn');
        console.log(response);
        var message = new Message();
        message = response;

        if (message.senderId == this.CurrentUserId) {
          message.type = 'sent';
          console.log('sender');

          
          
          this.messages.push(message);
        } else if (message.receiverId == this.CurrentUserId) {
          message.type = 'received';
          console.log('receiver');

          var userIndex = this.getUserIndex(message.senderId);
          if (userIndex == -1) {
            console.log('Một user mới');
            this.messageService.GetChatFriend(this.CurrentUserId, message.senderId)
              .then(response=>{
                var newFriend = new ChatFriend();
                newFriend = response;
                console.log('this is response');
                console.log(newFriend);
                this.friendList.push(newFriend);
                return;
              })
              .catch(error =>{
                alert("Can not get display user");
                return;
              })
          }


          this.messages.push(message);
        } else {
          console.log("nothing!");
        }

        // if (message.senderId == this.CurrentUserId) {
        //   message.type = 'sent';
        //   console.log('sender');
        //   this.messages.push(message);
        // } else if (message.receiverId == this.CurrentUserId) {
        //   message.type = 'received';
        //   console.log('receiver');
        //   this.messages.push(message);
        // } else {
        //   console.log("nothing!");
        // }

      })

      console.log(JSON.stringify(this.messages));
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
      console.log(this.friendList[i].user.id);
      if (this.friendList[i].user.id == userId) {
        return i;
      }
    }
    return index;
  }

  MoreMessages = (userId: string, userIndex: number) => {
    this.messageService.moreMessages(1, this.PageSize, this.CurrentUserId, userId)
      .then(data => {
        //console.log(data);
        //this.PageIndex += 1;
        this.messages = new Array<Message>();
        data.forEach(element => {
          if (this.IsExist(element.id)) {
            //
            var message = new Message();
            message = element;

            this.messages.splice(0, 0, message);
          }
        });
        this.friendList[userIndex].messages = this.messages;
        console.log(this.friendList[userIndex].messages)
      })
      .catch(error => {

      })
  }

  clickSendUser = (idUser) => {
    console.log(idUser);
    this.DestUserId = idUser;
    var userIndex = this.getUserIndex(idUser);
    this.UserIndex = userIndex;
    this.MoreMessages(idUser, this.UserIndex);
  }

}


            // if (message.senderId == this.CurrentUserId) {
            //   message.type = 'sent';
            //   console.log('sender');
            //   console.log(message);
            //   this.messages.splice(0, 0, message);
            // } else if (message.receiverId == this.CurrentUserId) {
            //   message.type = 'received';
            //   console.log('receiver');
            //   console.log(message);
            //   this.messages.splice(0, 0, message);
            // }

            //