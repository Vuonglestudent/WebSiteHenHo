import { UrlMainService } from './url-main.service';
import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Message } from '../models/models';
import { AppComponent } from '../app.component';
import { HttpClient  } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  messageReceived = new EventEmitter<Message>();
  private hubConnection: signalR.HubConnection;
  private MainUrl = `${this.url.urlHost}`;
  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.url.urlHost}/chatHub`)
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

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferData', (data) => {
      this.messageReceived.emit(data);
    });
  }




  constructor(
    private httpClient: HttpClient,
    private url: UrlMainService
  ) { }
}
