import { UrlMainService } from './url-main.service';
import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { INotification, ISignal, IUser, IUserInfo, Message, SignalType, UserConnection } from '../models/models';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  private _hubConnection: signalR.HubConnection;
  private _connections: { [index: string]: UserConnection } = {};

  private onlineCount: number = 0;
  private onlineCountSub = new BehaviorSubject<number>(0);
  public onlineCountObservable = this.onlineCountSub.asObservable();

  private notification: INotification = {} as INotification;
  private notificationCountSub = new BehaviorSubject<INotification>(undefined);
  public notificationObservable = this.notificationCountSub.asObservable();

  private connSub = new BehaviorSubject<boolean>(false);
  public connObservable = this.connSub.asObservable();
  private usersSub = new BehaviorSubject<UserConnection[]>(undefined);
  public usersObservable = this.usersSub.asObservable();

  public currentConnectionId: string;
  public currentRoomName: string;
  public currentMediaStream: MediaStream;
  public currentIceServers: RTCIceServer[];

  public connected = false;
  private connectedSub = new BehaviorSubject<boolean>(false);
  public connectedObservable = this.connectedSub.asObservable();

  public targetInfo: IUser;

  public callerInfo: IUser;
  private callerSub = new BehaviorSubject<IUser>(undefined);
  public callerObservable = this.callerSub.asObservable();

  private myInfo: IUser;
  private myInfoSub = new BehaviorSubject<IUser>(undefined);
  public myInfoObservable = this.myInfoSub.asObservable();

  //////////////////////////////////////////////////

  //messageReceived = new EventEmitter<Message>();

  private message = new Message();
  private messageSub = new BehaviorSubject<Message>(undefined);
  public messageObservable = this.messageSub.asObservable();

  public connectionId: string;

  public startConnection = () => {
    (async () => {
      try {
        await this._hubConnection.start();
        const connectionId = await this._hubConnection.invoke('GetConnectionId');
        this.currentConnectionId = connectionId;
        this.connected = true;
        this.connectedSub.next(true);

        this.closeAllVideoCalls();
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

    this._hubConnection
      .on('callToUserList', async (roomName: string, users: IUser[]) => {
        if (this.currentRoomName === roomName) {
          users.forEach(user => {
            if (this._connections[user.connectionId] === undefined
              && user.connectionId !== this.currentConnectionId) {
              this.initiateOffer(user);
            }
          });

          await this.updateUserList(users);
        }
      });

    this._hubConnection
      .on('updateUserList', async (roomName: string, users: IUser[]) => {
        if (this.currentRoomName === roomName) {
          Object.keys(this._connections)
            .forEach(key => {
              if (!users.find(user => user.connectionId === key)) {
                this.closeVideoCall(key);
              }
            });
          await this.updateUserList(users);
        }
      });

    this._hubConnection
      .on('receiveSignal', async (user: IUser, signal: string) => {
        await this.newSignal(user, signal);
      });

      //Nhận thông tin người gọi
    this._hubConnection
      .on("callerInfo", async (user: IUser) => {
        this.callerInfo = user;
        this.callerSub.next(user);
      })

      //Nhận số lượng online
    this._hubConnection
      .on('onlineCount', async (onlineCount: number) => {
        this.onlineCount = onlineCount;
        this.onlineCountSub.next(this.onlineCount);
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
  }

  public getConnectionId = () => {
    this._hubConnection.invoke('getconnectionid').then(
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
      //.withUrl(`https://hieuit.tech:5201/chatHub`)
      .build();

    this.authenticationService.userInfoObservable
      .subscribe(user => this.userInfo = user)
  }

  //////////////////////////////////////////////////////////////
  private reset() {
    this.connected = false;
    this.connectedSub.next(false);
    this.connSub.next(false);
    this.usersSub.next(undefined);
  }

  public async getMyInfo() {
    var myInfo = await this._hubConnection.invoke("getMyInfo", this.userInfo.id, this.currentConnectionId, this.userInfo.fullName);
    this.myInfoSub.next(myInfo);
    return myInfo;
  }

  public async getTargetInfo(userId: string) {
    return await this._hubConnection.invoke("getTargetInfo", userId);
  }
  

  private async updateUserList(users: IUser[]): Promise<void> {
    const iceServers = await this.getIceServers();
    users.forEach(async user => {
      const connection = await this.getConnection(user.connectionId, iceServers, false);
      if (connection.user.userName !== user.userName) {
        connection.user.userName = user.userName;
      }
      if (connection.isCurrentUser && connection.streamSub.getValue() === undefined) {
        const stream = await this.getUserMediaInternal();

        if (connection.streamSub.getValue() === undefined) {
          connection.streamSub.next(stream);
        }
      }
    });

    this.usersSub.next(Object.values(this._connections));
  }

  public join(userId: string, userName: string, isCaller: boolean) {
    if (!this.connected) {
      this.reset();

      return;
    }

    this.closeAllVideoCalls();

    this._connections[this.currentConnectionId] =
      new UserConnection({ userId: userId, connectionId: this.currentConnectionId, userName: userName }, true, undefined);

    if (isCaller) {
      this.currentRoomName = userId;
    }
    else {
      this.currentRoomName = this.callerInfo.userId;
    }

    this._hubConnection
      .invoke('Join', userId, this.currentConnectionId, userName, this.currentRoomName, false);
  }

  public hangUp() {
    this._hubConnection.invoke('hangUp');
    this.closeAllVideoCalls();

    //this.closeVideoCall(this.currentConnectionId);
  }


  //Yêu cầu quyền truy cập
  private async getUserMediaInternal(): Promise<MediaStream> {
    if (this.currentMediaStream) {
      return this.currentMediaStream;
    }

    try {
      return await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
    } catch (error) {
      console.error('Failed to get hardware access', error);
    }
  }

  //Get RTC server
  private async getIceServers(): Promise<RTCIceServer[]> {
    if (this.currentIceServers) {
      return this.currentIceServers;
    }

    try {
      return await this._hubConnection
        .invoke('GetIceServers');
    } catch (error) {
      console.error('GetIceServers error: ', error);
    }
  }

  private async initiateOffer(acceptingUser: IUser) {
    const partnerClientId = acceptingUser.connectionId;

    console.log('Initiate offer to ' + acceptingUser.userName);

    if (this._connections[partnerClientId]) {
      console.log('Cannot initiate an offer with existing partner.');
      return;
    }

    const iceServers = await this.getIceServers();

    await this.getConnection(partnerClientId, iceServers, true);
  }

  private async sendSignal(message: ISignal, partnerClientId: string) {
    await this._hubConnection.invoke('SendSignal', JSON.stringify(message), partnerClientId);
  }

  private async newSignal(user: IUser, data: string) {
    const partnerClientId = user.connectionId;
    const signal: ISignal = JSON.parse(data);

    console.log('WebRTC: received signal');

    if (signal.type === SignalType.newIceCandidate) {
      await this.receivedNewIceCandidate(partnerClientId, signal.candidate);
    } else if (signal.type === SignalType.videoOffer) {
      await this.receivedVideoOffer(partnerClientId, signal.sdp);
    } else if (signal.type === SignalType.videoAnswer) {
      await this.receivedVideoAnswer(partnerClientId, signal.sdp);
    }
  }

  private async receivedNewIceCandidate(partnerClientId: string, candidate: RTCIceCandidate) {
    console.log('Adding received ICE candidate: ' + JSON.stringify(candidate));

    try {
      const iceServers = await this.getIceServers();
      const connection = await this.getConnection(partnerClientId, iceServers, false);
      await connection.rtcConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  private async receivedVideoOffer(partnerClientId: string, sdp: RTCSessionDescription) {

    console.log('Starting to accept invitation from ' + partnerClientId);

    const desc = new RTCSessionDescription(sdp);
    const iceServers = await this.getIceServers();
    const connection = await this.getConnection(partnerClientId, iceServers, false);

    if (connection.creatingAnswer) {
      console.warn('Second answer not created.');

      return;
    }
    connection.creatingAnswer = true;

    try {
      console.log('setRemoteDescription');
      await connection.rtcConnection.setRemoteDescription(desc);
      console.log('createAnswer');
      const senders = connection.rtcConnection.getSenders();
      if (!senders || senders.length === 0) {
        console.log('AddSenders needed');
        const localStream = await this.getUserMediaInternal();
        localStream.getTracks().forEach(track => connection.rtcConnection.addTrack(track, localStream));
      }
      const answer = await connection.rtcConnection.createAnswer();
      console.log('setLocalDescription', answer);
      await connection.rtcConnection.setLocalDescription(answer);
      await this.sendSignal({
        type: SignalType.videoAnswer,
        sdp: connection.rtcConnection.localDescription
      }, partnerClientId);
    } catch (error) {
      console.error('Error in receivedVideoOffer:', error);
    }

    connection.creatingAnswer = false;
  }

  private async receivedVideoAnswer(partnerClientId: string, sdp: RTCSessionDescription) {
    console.log('Call recipient has accepted our call');

    try {
      const iceServers = await this.getIceServers();
      const connection = await this.getConnection(partnerClientId, iceServers, false);

      await connection.rtcConnection.setRemoteDescription(sdp);
    } catch (error) {
      console.error('Error in receivedVideoAnswer:', error);
    }
  }

  private async getConnection(partnerClientId: string, iceServers: RTCIceServer[], createOffer: boolean): Promise<UserConnection> {
    const connection = this._connections[partnerClientId]
      || (await this.createConnection(partnerClientId, iceServers, createOffer));
    return connection;
  }

  private async createConnection(partnerClientId: string, iceServers: RTCIceServer[], createOffer: boolean): Promise<UserConnection> {
    console.log('WebRTC: creating connection...');

    if (this._connections[partnerClientId]) {
      this.closeVideoCall(partnerClientId);
    }

    const connection = new RTCPeerConnection({ iceServers: iceServers });
    const userConnection = new UserConnection({ userId: '', connectionId: partnerClientId, userName: '' },
      false, connection);

    this._connections[partnerClientId] = userConnection;



    const localStream = await this.getUserMediaInternal();
    localStream.getTracks().forEach(track => connection.addTrack(track, localStream));

    connection.oniceconnectionstatechange = () => {
      switch (connection.iceConnectionState) {
        case 'closed':
        case 'failed':
        case 'disconnected':
          this.closeAllVideoCalls();
          break;
      }
    };
    connection.onicegatheringstatechange = () => {
      console.log('*** ICE gathering state changed to: ' + connection.iceGatheringState);
    };
    connection.onsignalingstatechange = (event) => {
      console.log('*** WebRTC signaling state changed to: ' + connection.signalingState);
      switch (connection.signalingState) {
        case 'closed':
          this.closeAllVideoCalls();
          break;
      }
    };
    connection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log('WebRTC: new ICE candidate');
        await this.sendSignal({
          type: SignalType.newIceCandidate,
          candidate: event.candidate
        }, partnerClientId);
      } else {
        console.log('WebRTC: ICE candidate gathering complete');
      }
    };
    connection.onconnectionstatechange = (state) => {
      const states = {
        'iceConnectionState': connection.iceConnectionState,
        'iceGatheringState': connection.iceGatheringState,
        'connectionState': connection.connectionState,
        'signalingState': connection.signalingState
      };

      console.log(JSON.stringify(states), state);
    };

    connection.ontrack = (event) => {
      console.log('Track received from ' + partnerClientId);
      userConnection.setStream(event.streams[0]);
    };

    if (createOffer) {
      try {
        const desc = await connection.createOffer();

        await connection.setLocalDescription(desc);
        await this.sendSignal({
          type: SignalType.videoOffer,
          sdp: connection.localDescription
        }, partnerClientId);
      } catch (error) {
        console.error('Error in onnegotiationneeded:', error);
      }
    }

    return userConnection;
  }

  private closeAllVideoCalls() {
    this.closeVideoCall(this.currentConnectionId);
    Object.keys(this._connections)
      .forEach(key => {
        this.closeVideoCall(key);
      });
    this._connections = {};
  }

  private closeVideoCall(partnerClientId: string) {
    const connection = this._connections[partnerClientId];
    if (connection) {
      connection.end();
      this._connections[partnerClientId] = undefined;

      delete this._connections[partnerClientId];
    }
  }

  public getUserById(userId: string) {
    return this._hubConnection.invoke('GetUserById', userId);
  }
}
