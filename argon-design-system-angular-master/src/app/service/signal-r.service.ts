import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Message } from '../Models/Models';
import { AppComponent } from '../app.component';
import { HttpClient  } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  messageReceived = new EventEmitter<Message>();
  private MainUrl = 'http://localhost:5000';
  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub')
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started!')
      })
      .catch(error => {
        console.log('Can not start connection with error: ' + error);
      })
  }

  public addTransferChartDataListener = (currentUserId) => {
    this.hubConnection.on('transferData', (data) => {
      this.messageReceived.emit(data);
    });
  }

  public moreMessages = (PageIndex: number, PageSize: number, SenderId: string, ReceiverId: string) => {
    var query = `?PageIndex=${PageIndex}&PageSize=${PageSize}&SenderId=${SenderId}&ReceiverId=${ReceiverId}`;
    var url = this.MainUrl + '/api/Chats/MoreMessages'+ query;
    console.log(url);
    var data = {
      SenderId: SenderId,
      ReceiverId: ReceiverId
    }
    return this.httpClient.get<any>(url).toPromise();
  }


  constructor(
    private httpClient: HttpClient
  ) { }
}
