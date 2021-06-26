import { UrlMainService } from './url-main.service';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { INotification, IUser, IUserInfo, Message, SignalType } from '../../models/models';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';

export interface Signal {
  type: SignalType;
  data: any;
}

export enum CallType {
  VideoCall,
  VoiceCall
}

export enum CallStatus {
  Accepted,
  Rejected
}

@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  private _hubConnection: signalR.HubConnection;

  private onlineCountSub = new BehaviorSubject<number>(0);
  public onlineCountObservable = this.onlineCountSub.asObservable();

  private notification: INotification = {} as INotification;
  private notificationCountSub = new BehaviorSubject<INotification>(undefined);
  public notificationObservable = this.notificationCountSub.asObservable();

  private connSub = new BehaviorSubject<boolean>(false);
  public connObservable = this.connSub.asObservable();

  private callStatusSub = new BehaviorSubject<CallStatus>(undefined);
  public callStatusObservable = this.callStatusSub.asObservable();

  public connected = false;
  private connectedSub = new BehaviorSubject<boolean>(false);
  public connectedObservable = this.connectedSub.asObservable();

  private callerSub = new BehaviorSubject<IUser>(undefined);
  public callerObservable = this.callerSub.asObservable();

  private myInfoSub = new BehaviorSubject<IUser>(undefined);
  public myInfoObservable = this.myInfoSub.asObservable();

  private signalSub = new BehaviorSubject<string>(undefined);
  public signalObservable = this.signalSub.asObservable();

  //////////////////////////////////////////////////

  private message = new Message();
  private messageSub = new BehaviorSubject<Message>(undefined);
  public messageObservable = this.messageSub.asObservable();

  public connectionId: string;
  RTCPeerConfiguration: {
    iceServers: [
      {
        urls: 'turn:turn02.hubl.in?transport=tcp',
        userName: '',
        credential: ''
      }
    ]
  }

  public startConnection = () => {
    (async () => {
      try {
        await this._hubConnection.start();
        this.connectionId = await this._hubConnection.invoke('GetConnectionId');
        this.connected = true;
        this.connectedSub.next(true);

        this.connSub.next(true);

      } catch (error) {
        console.error(error);
      }
    })();

    this._hubConnection
      .onclose((err) => {
        console.error(err);
        this.connected = false;
        this.connSub.next(false);
        this.reset();
      });

    //Nhận số lượng online
    this._hubConnection
      .on('onlineCount', async (onlineCount: number) => {
        this.onlineCountSub.next(onlineCount);
      })

    //Nhận thông báo
    this._hubConnection
      .on('notification', async (notification: INotification) => {
        this.notification = notification;
        this.notificationCountSub.next(this.notification);
      })

    //Nhận tin nhắn
    this._hubConnection
      .on('messageResponse', async (message: Message) => {
        this.message = message;
        this.messageSub.next(this.message);
      })

    this._hubConnection
      .on('CallRequest', async (caller: IUser, callTye: CallType) => {
        caller.callType = callTye;
        this.callerSub.next(caller);
      })

    this._hubConnection
      .on("callStatus", async (status: CallStatus) => {
        this.callStatusSub.next(status);
      })

  }

  public getConnectionId = () => {
    this._hubConnection.invoke('getConnectionId').then(
      (data) => {
        this.connectionId = data;
      }
    );
  }

  userInfo: IUserInfo;
  constructor(
    private authenticationService: AuthenticationService,
    private url: UrlMainService
  ) {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.url.urlHost}/chatHub`)
      .build();

    this.authenticationService.userInfoObservable
      .subscribe(user => this.userInfo = user)

    this._hubConnection
      .on('receiveSignal', async (signal: string) => {
        this.signalSub.next(signal);
      });

  }
  private reset() {
    this.connected = false;
    this.connectedSub.next(false);
    this.connSub.next(false);
  }

  public async saveMyInfo() {
    var myInfo = await this._hubConnection.invoke("saveMyInfo", this.userInfo.id, this.connectionId, this.userInfo.fullName, this.userInfo.avatarPath);
    this.myInfoSub.next(myInfo);
  }

  public async getUserById(userId: string) {
    return await this._hubConnection.invoke('GetUserById', userId);
  }

  public async getUserByConnectionId(connectionId: string) {
    return await this._hubConnection.invoke('GetUserByConnectionId', connectionId);
  }

  public async callRequest(userId: string, callType: CallType) {
    return await this._hubConnection.invoke('CallRequest', userId, callType);
  }

  public async callAccept(connectionId: string) {
    return await this._hubConnection.invoke('CallAccept', connectionId);
  }

  public async callReject(connectionId: string) {
    return await this._hubConnection.invoke('CallReject', connectionId);
  }

  public async sendSignal(signal: Signal, receiverId: string) {
    await this._hubConnection.invoke('SendSignal', JSON.stringify(signal), receiverId);
  }
}