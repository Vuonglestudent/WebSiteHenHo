import { UrlMainService } from './url-main.service';
import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { Message } from '../models/models';
import { AppComponent } from '../app.component';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../user-components/signup/authentication.service';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {
  messageReceived = new EventEmitter<Message>();
  private hubConnection: signalR.HubConnection;
  public connectionId: string;
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
      .then(() => this.getConnectionId())
      .catch(error => {
        console.log('Can not start connection with error: ' + error);
      })
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferData', (data) => {
      this.messageReceived.emit(data);
    });
  }

  public getConnectionId = () => {
    this.hubConnection.invoke('getconnectionid').then(
      (data) => {
        this.connectionId = data;
        this.SaveHubId();
      }
    );
  }

  public SaveHubId = () => {
    var headers = this.authenticationService.GetHeader();
    console.log(this.authenticationService.UserInfo.Id)
    console.log(this.connectionId)
    var connectionId = this.connectionId;
    var path = this.MainUrl + '/api/v1/users/hub?userId=' + this.authenticationService.UserInfo.Id;
    console.log(path)
    var data = new FormData();
    data.append("connectionId", this.connectionId);
    return this.http.put<any>(path, data, {headers: headers}).toPromise();
  }

  constructor(
    private authenticationService : AuthenticationService,
    private http: HttpClient,
    private url: UrlMainService
  ) { }
}
