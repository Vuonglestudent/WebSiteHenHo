import { UrlMainService } from './url-main.service';
import { Injectable, EventEmitter } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { INotification, ISignal, IUser, IUserInfo, Message, SignalType, UserConnection } from '../../models/models';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

export class SignalRService {

  private _hubConnection: signalR.HubConnection;

  private onlineCount: number = 0;
  private onlineCountSub = new BehaviorSubject<number>(0);
  public onlineCountObservable = this.onlineCountSub.asObservable();

  private notification: INotification = {} as INotification;
  private notificationCountSub = new BehaviorSubject<INotification>(undefined);
  public notificationObservable = this.notificationCountSub.asObservable();

  private connSub = new BehaviorSubject<boolean>(false);
  public connObservable = this.connSub.asObservable();

  private localConnection: UserConnection;
  private localConnectionSub = new BehaviorSubject<UserConnection>(undefined);
  public localConnectionObservable = this.localConnectionSub.asObservable();

  private partnerConnection: UserConnection;
  private partnerConnectionSub = new BehaviorSubject<UserConnection>(undefined);
  public partnerConnectionObservable = this.partnerConnectionSub.asObservable();

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
      .on('callToUserList', async (roomName: string, users: IUser[], callType: CallType) => {
        if (this.currentRoomName === roomName) {
          users.forEach(user => {
            if (user.connectionId !== this.currentConnectionId) {
              this.initiateOffer(user, callType);
            }
          });

          await this.updateUserList(users, callType);
        }
      });

    this._hubConnection
      .on('updateUserList', async (roomName: string, users: IUser[], callType: CallType) => {
        if (this.currentRoomName === roomName) {
          await this.updateUserList(users, callType);
        }
      });

    this._hubConnection
      .on('receiveSignal', async (user: IUser, signal: string, callType: CallType) => {
        await this.newSignal(user, signal, callType);
      });

    //Nhận thông tin người gọi
    this._hubConnection
      .on("callerInfo", async (user: IUser, callType: CallType) => {
        this.callerInfo = user;
        this.callerInfo.callType = callType;
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
      .build();

    this.authenticationService.userInfoObservable
      .subscribe(user => this.userInfo = user)
  }

  //////////////////////////////////////////////////////////////
  private reset() {
    this.connected = false;
    this.connectedSub.next(false);
    this.connSub.next(false);
    this.localConnectionSub.next(undefined);
    this.partnerConnectionSub.next(undefined);
  }

  public async getMyInfo() {
    var myInfo = await this._hubConnection.invoke("getMyInfo", this.userInfo.id, this.currentConnectionId, this.userInfo.fullName, this.userInfo.avatarPath);
    this.myInfoSub.next(myInfo);
    return myInfo;
  }

  public async getTargetInfo(userId: string, callType: CallType) {
    return await this._hubConnection.invoke("getTargetInfo", userId, callType);
  }


  private async updateUserList(users: IUser[], callType: CallType): Promise<void> {
    const iceServers = await this.getIceServers();
    users.forEach(async user => {
      var connection = {} as UserConnection;
      //  
      if (user.connectionId == this.currentConnectionId) {
        connection = await this.getLocalConnection(user.connectionId, iceServers, false, callType);
      }
      else {
        connection = await this.getPartnerConnection(user.connectionId, iceServers, false, callType);
      }

      if (connection.user.userName !== user.userName) {
        connection.user.userName = user.userName;
      }
      if (connection.isCurrentUser && connection.streamSub.getValue() === undefined) {
        const stream = await this.getUserMediaInternal(connection.callType);

        if (connection.streamSub.getValue() === undefined) {
          connection.streamSub.next(stream);
        }
      }
    });

    this.localConnectionSub.next(this.localConnection);
    this.partnerConnectionSub.next(this.partnerConnection);
  }

  public join(userId: string, userName: string, avatarPath: string, isCaller: boolean, callType: CallType) {
    if (!this.connected) {
      this.reset();

      return;
    }

    this.closeAllVideoCalls();

    this.localConnection =
      new UserConnection({ userId: userId, connectionId: this.currentConnectionId, userName: userName, avatarPath: avatarPath } as IUser, true, undefined, callType);

    if (isCaller) {
      this.currentRoomName = userId;
    }
    else {
      this.currentRoomName = this.callerInfo.userId;
    }

    //Khi chạy trên mobile thì truyền vào true.
    this._hubConnection  
      .invoke('Join', userId, this.currentConnectionId, userName, avatarPath, this.currentRoomName, false, callType);
  }

  public hangUp() {
    this._hubConnection.invoke('hangUp');
    this.closeAllVideoCalls();
  }


  //Yêu cầu quyền truy cập
  private async getUserMediaInternal(callType: CallType): Promise<MediaStream> {
    if (this.currentMediaStream) {
      return this.currentMediaStream;
    }

    let isVideoOn = callType == CallType.VideoCall ? true : false;

    try {
      return await navigator.mediaDevices.getUserMedia({
        video: isVideoOn,
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

  private async initiateOffer(acceptingUser: IUser, callType: CallType) {
    const partnerClientId = acceptingUser.connectionId;

    console.log('Initiate offer to ' + acceptingUser.userName);

    if (this.partnerConnection) {
      console.log('Cannot initiate an offer with existing partner.');
      return;
    }

    const iceServers = await this.getIceServers();

    await this.getPartnerConnection(partnerClientId, iceServers, true, callType);
  }

  private async sendSignal(message: ISignal, partnerClientId: string, callType: CallType) {
    await this._hubConnection.invoke('SendSignal', JSON.stringify(message), partnerClientId, callType);
  }

  private async newSignal(user: IUser, data: string, callType: CallType) {
    const partnerClientId = user.connectionId;
    const signal: ISignal = JSON.parse(data);

    console.log('WebRTC: received signal');

    if (signal.type === SignalType.newIceCandidate) {
      await this.receivedNewIceCandidate(partnerClientId, signal.candidate, callType);
    } else if (signal.type === SignalType.videoOffer) {
      await this.receivedVideoOffer(partnerClientId, signal.sdp, callType);
    } else if (signal.type === SignalType.videoAnswer) {
      await this.receivedVideoAnswer(partnerClientId, signal.sdp, callType);
    }
  }

  private async receivedNewIceCandidate(partnerClientId: string, candidate: RTCIceCandidate, callType: CallType) {
    console.log('Adding received ICE candidate: ' + JSON.stringify(candidate));

    try {
      const iceServers = await this.getIceServers();
      const connection = await this.getPartnerConnection(partnerClientId, iceServers, false, callType);
      await connection.rtcConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  private async receivedVideoOffer(partnerClientId: string, sdp: RTCSessionDescription, callType: CallType) {

    console.log('Starting to accept invitation from ' + partnerClientId);

    const desc = new RTCSessionDescription(sdp);
    const iceServers = await this.getIceServers();
    const connection = await this.getPartnerConnection(partnerClientId, iceServers, false, callType);

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
        const localStream = await this.getUserMediaInternal(connection.callType);
        localStream.getTracks().forEach(track => connection.rtcConnection.addTrack(track, localStream));
      }
      const answer = await connection.rtcConnection.createAnswer();
      console.log('setLocalDescription', answer);
      await connection.rtcConnection.setLocalDescription(answer);
      await this.sendSignal({
        type: SignalType.videoAnswer,
        sdp: connection.rtcConnection.localDescription
      }, partnerClientId, callType);
    } catch (error) {
      console.error('Error in receivedVideoOffer:', error);
    }

    connection.creatingAnswer = false;
  }

  private async receivedVideoAnswer(partnerClientId: string, sdp: RTCSessionDescription, callType: CallType) {
    console.log('Call recipient has accepted our call');

    try {
      const iceServers = await this.getIceServers();
      const connection = await this.getPartnerConnection(partnerClientId, iceServers, false, callType);

      await connection.rtcConnection.setRemoteDescription(sdp);
    } catch (error) {
      console.error('Error in receivedVideoAnswer:', error);
    }
  }

  private async getLocalConnection(connectionId: string, iceServers: RTCIceServer[], createOffer: boolean, callType: CallType): Promise<UserConnection> {
    const connection = this.localConnection
      || (await this.createConnection(true, connectionId, iceServers, createOffer, callType));
    return connection;

  }

  private async getPartnerConnection(connectionId: string, iceServers: RTCIceServer[], createOffer: boolean, callType: CallType): Promise<UserConnection> {
    const connection = this.partnerConnection
      || (await this.createConnection(false, connectionId, iceServers, createOffer, callType));
    return connection;

  }

  private async createConnection(isLocal: boolean, partnerClientId: string, iceServers: RTCIceServer[], createOffer: boolean, callType: CallType): Promise<UserConnection> {
    console.log('WebRTC: creating connection...');

    const connection = new RTCPeerConnection({ iceServers: iceServers });
    const userConnection = new UserConnection({ userId: '', connectionId: partnerClientId, userName: '' } as IUser,
      false, connection, callType);

    isLocal ? this.localConnection = userConnection : this.partnerConnection = userConnection;

    const localStream = await this.getUserMediaInternal(userConnection.callType);
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
        }, partnerClientId, callType);
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
        }, partnerClientId, callType);
      } catch (error) {
        console.error('Error in onnegotiationneeded:', error);
      }
    }

    return userConnection;
  }

  private closeAllVideoCalls() {
    this.closeLocalVideoCall();
    this.closePartnerVideoCall();
  }

  private closeLocalVideoCall() {
    const connection = this.localConnection;
    if (connection) {
      connection.end();
      this.localConnection = undefined;

      delete this.localConnection;
    }
  }

  private closePartnerVideoCall() {
    const connection = this.partnerConnection;
    if (connection) {
      connection.end();
      this.partnerConnection = undefined;

      delete this.partnerConnection;
    }
  }

  public getUserById(userId: string) {
    return this._hubConnection.invoke('GetUserById', userId);
  }
}

export enum CallType {
  VideoCall,
  VoiceCall
}