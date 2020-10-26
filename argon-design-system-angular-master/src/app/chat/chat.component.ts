import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { SignalRService } from '../service/signal-r.service';
import { HttpClient } from '@angular/common/http';
import { Message } from '../Models/Models';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {

  constructor(
    public signalRService: SignalRService,
    private http: HttpClient,
    private _ngZone: NgZone
  ) {
    this.subscribeToEvents();
   }

  IsStarted = false;

  public CurrentUserId = '';

  public DestUserId = "";
  public PageIndex = 1;
  public PageSize = 20;
  public From: string;
  public To: string;

  SenderId: string;
  ReceiverId: string;
  txtMessage: string = '';
  messages = new Array<Message>();
  message = new Message();
  

  ngOnInit(): void {

    this.CurrentUserId = "ec826af8-0310-48cf-8a14-da11bdb1c96d";
    this.DestUserId = "ec826af8-0310-48cf-8a14-da11bdb1c96e"

    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener(this.CurrentUserId);
    
    //this.startHttpRequest();
  }
  ngAfterViewInit(): void {
    this.PageIndex = 1;
    this.messages = new Array<Message>();
    this.MoreMessages();
  }

  private startHttpRequest = () => {
    this.ReceiverId = this.DestUserId;
    this.SenderId = this.CurrentUserId;

    var formdata = new FormData();
    formdata.append("SenderId", this.SenderId);
    formdata.append("ReceiverId", this.ReceiverId);
    formdata.append("Content", this.txtMessage);
    this.http.post('http://localhost:5000/api/chats', formdata)
      .subscribe(res => {
        console.log('this is res');
        console.log(res);
      });
  }

  sendMessage(): void {
    if(this.CurrentUserId == "" || this.DestUserId == ""){
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }
    
    if (this.txtMessage != '') {
      this.message = new Message();
      this.messages.push(this.message);

      this.startHttpRequest();
      this.txtMessage = '';
    }
  }

  subscribeToEvents = () => {
    this.signalRService.messageReceived.subscribe((response: any) => {
      this._ngZone.run(() => {
        console.log(response);
        var message = new Message();
        message.Content = response.content;
        message.SenderId = response.senderId;
        message.ReceiverId = response.receiverId;
        message.SentAt = response.sentAt;
        message.Id = response.id;

        if (message.SenderId == this.CurrentUserId) {
          message.Type = 'sent';
          console.log('sender');
          this.messages.push(message);
        } else if (message.ReceiverId == this.CurrentUserId) {
          message.Type = 'received';
          console.log('receiver');
          this.messages.push(message);
        } else {
          console.log("nothing!");
        }

      })

      console.log(JSON.stringify(this.messages));
    })
  }

  onSubmit(f: NgForm){
    if(f.value.From == "" || f.value.To == ""){
      alert("Điền đầy đủ thông tin người nhận người gửi!");
      return;
    }
    this.CurrentUserId = f.value.From;
    this.DestUserId = f.value.To;
    alert("Ok let start chat!");
  }

  IsExist = (messageId: number) => {
    this.messages.forEach(element => {
      if(element.Id == messageId){
        return false;
      }
    });
    return true;
  }

  MoreMessages = () =>{
    this.signalRService.moreMessages(this.PageIndex, this.PageSize, this.CurrentUserId, this.DestUserId)
      .then(data =>{
        console.log(data);
        this.PageIndex += 1;

        data.forEach(element => {
          if(this.IsExist(element.id)){
            //            
            var message = new Message();
            message.Content = element.content;
            message.SenderId = element.senderId;
            message.ReceiverId = element.receiverId;
            message.SentAt = element.sentAt;
            message.Id = element.id;
    
            if (message.SenderId == this.CurrentUserId) {
              message.Type = 'sent';
              console.log('sender');
              console.log(message);
              this.messages.splice(0, 0, message);
            } else if (message.ReceiverId == this.CurrentUserId) {
              message.Type = 'received';
              console.log('receiver');
              console.log(message);
              this.messages.splice(0, 0, message);
            }

            //

          }  
        });
        console.log(this.messages)
      })
      .catch(error =>{

      })
  }


  clickSendUser = (idUser) => {
    console.log(idUser)
    this.DestUserId = idUser;
    console.log(this.messages)
  }

  breakRow = (e) => {
    var message = e.target
    this.txtMessage = this.txtMessage + "\n"
    message.setAttribute('value' , `${this.txtMessage}`)   
  }

  convertMessage = (msg) => {
    console.log(msg);
  }
}
