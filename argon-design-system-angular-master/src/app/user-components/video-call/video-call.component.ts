import { IUserInfo, SignalType } from './../../models/models';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/models/models';
import { CallStatus, CallType, Signal, SignalRService } from 'src/app/shared/service/signal-r.service';
import { AlertService } from 'src/app/shared/_alert';
import { AuthenticationService } from '../../shared/service/authentication.service';
import { faPhoneAlt, faMicrophone, faVideo } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  mediaConstraints = {
    audio: true,
    // video: { width: 300, height: 300 }
    // video: {width: 1280, height: 720} // 16:9
    // video: {width: 960, height: 540}  // 16:9
    video: { width: 640, height: 480 }  //  4:3
    // video: {width: 160, height: 120}  //  4:3
  };

  offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  };
  isLoading = false;
  isAccept;

  partnerId = '';
  CallType = CallType;

  localStream: MediaStream;

  partner: IUser;

  faPhoneAlt = faPhoneAlt;
  faMicrophone = faMicrophone;
  faVideo = faVideo;

  userInfo: IUserInfo = undefined;

  public currentMediaStream: MediaStream;
  callType: CallType = CallType.VoiceCall;

  private rtcConnection: RTCPeerConnection;

  @ViewChild('local_video') localVideo: ElementRef;
  @ViewChild('remote_video') remoteVideo: ElementRef;
  @ViewChild('openConfirmModal') confirmModal: ElementRef;

  startPromise: Promise<any>;

  options1 = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  options2 = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    public signalRService: SignalRService,
  ) {

    this.partnerId = this.route.snapshot.paramMap.get('id')?.toString() ?? "";
    this.isAccept = this.route.snapshot.paramMap.get('isAccept');
    this.callType = Number(this.route.snapshot.paramMap.get('callType'));
    this.offerOptions.offerToReceiveVideo = this.callType == CallType.VideoCall ? true : false;

    this.authenticationService.userInfoObservable
      .subscribe(user => {
        if (user != undefined) {
          this.userInfo = user;
        }
      })

    this.signalRService.myInfoObservable
      .subscribe((data) => {

        if (data != undefined) {
          if (this.isAccept == 'true') {

            this.onAcceptACall();
            console.log('accept a call')
          }
          else {
            this.onStartACall();
            console.log('start a call');

          }
        }
      })



    signalRService.signalObservable
      .subscribe(signal => {
        if (signal != undefined) {
          this.newSignal(signal);
          // (async () => {
          //   await 
          // })
        }
      })

    signalRService.callStatusObservable
      .subscribe(res => {
        if (res != undefined) {
          if (res === CallStatus.Accepted) {
            this.alertService.success("Đang kết nối đến " + this.partner.userName, this.options2);
            this.timeCount();
          }
          else {
            this.hangUp();
            this.confirmModal.nativeElement.click();
          }
        }
      })
  }

  ngOnInit() {


  }

  async onStartACall() {
    this.createPeerConnection();
    await this.requestMediaDevices();
    this.startLocalVideo();
    this.partner = await this.signalRService.getUserById(this.partnerId);

    if (!this.partner) {
      alert('Người dùng hiện không online!');
      return;
    }

    this.signalRService.callRequest(this.partner.userId, this.callType);
  }

  async onAcceptACall() {
    this.partner = await this.signalRService.getUserById(this.partnerId);
    if (this.partner == null) {
      this.alertService.warn("Người dùng không còn online", this.options1);
      this.hangUp();
    }
    await this.signalRService.callAccept(this.partnerId);
    this.call();
  }

  trackByFn(user: IUser) {
    return user.connectionId;
  }

  toggleAudio() {
    console.log('click toggleAudio');
  }

  toggleVideo() {
    console.log('click toggleVideo');
  }

  totalTime = 0;
  time: string;
  interval;

  timeCount() {
    var h = 0;
    var m = 0;
    var s = 0;

    var hour = '0';
    var minute = '0';
    var second = '0';

    this.interval = setInterval(() => {
      this.totalTime++;

      var tmp = this.totalTime % 3600;
      h = (this.totalTime - tmp) / 3600;
      tmp = (this.totalTime - h * 3600) % 60;
      m = (this.totalTime - h * 3600 - tmp) / 60;
      s = this.totalTime - (h * 3600 + m * 60);

      hour = h < 10 ? '0' + h : h.toString();
      minute = m < 10 ? '0' + m : m.toString();
      second = s < 10 ? '0' + s : s.toString();

      this.time = hour + ' : ' + minute + ' : ' + second;
    }, 1000)
  }

  async call(): Promise<void> {
    this.createPeerConnection();
    await this.requestMediaDevices();
    this.startLocalVideo();
    // Add the tracks from the local stream to the RTCPeerConnection
    this.localStream.getTracks().forEach(
      track => this.rtcConnection.addTrack(track, this.localStream)
    );

    try {
      console.log('+ create offer');
      const offer: RTCSessionDescriptionInit = await this.rtcConnection.createOffer(this.offerOptions);
      // Establish the offer as the local peer's current description.
      console.log('+ setLocalDescription');
      await this.rtcConnection.setLocalDescription(offer);
      this.timeCount();

      console.log('+ send offer');
      this.sendSignal({ type: SignalType.Offer, data: offer });
    } catch (err) {
      this.handleGetUserMediaError(err);
    }
  }



  hangUp(): void {
    console.log('+ send hangup');
    this.sendSignal({ type: SignalType.HangUp, data: '' });
    this.closeVideoCall();
  }

  private async newSignal(data: string) {
    const signal = JSON.parse(data);

    console.log(signal.type);
    switch (signal.type) {
      case SignalType.Offer:
        await this.handleOfferMessage(signal.data);
        break;

      case SignalType.Answer:
        await this.handleAnswerMessage(signal.data);
        break;

      case SignalType.iceCandidate:
        await this.handleICECandidateMessage(signal.data);
        break;

      case SignalType.HangUp:
        this.handleHangupMessage(signal);
        break;

      default:
        console.log('unknown message of type ' + signal.type);
        break;
    }
  }
  /* ########################  MESSAGE HANDLER  ################################## */

  private async handleOfferMessage(msg: RTCSessionDescriptionInit) {
    if (!this.rtcConnection) {
      this.createPeerConnection();
    }

    if (!this.localStream) {
      this.startLocalVideo();
    }
    console.log('+ setRemoteDescription');
    await this.rtcConnection.setRemoteDescription(new RTCSessionDescription(msg));
    // add media stream to local video
    this.localVideo.nativeElement.srcObject = this.localStream;

    // add media tracks to remote connection
    console.log('+ add stream to connection');
    this.localStream.getTracks().forEach(
      track => this.rtcConnection.addTrack(track, this.localStream)
    );

    console.log('+ create answer');
    const answer = await this.rtcConnection.createAnswer();
    console.log('setLocalDescription');
    await this.rtcConnection.setLocalDescription(answer);

    console.log('+ send answer');
    this.sendSignal({ type: SignalType.Answer, data: this.rtcConnection.localDescription });
  }

  private async handleAnswerMessage(msg: RTCSessionDescriptionInit) {
    console.log('+ setRemoteDescription');
    await this.rtcConnection.setRemoteDescription(msg);
  }

  private handleHangupMessage(msg: Signal): void {
    this.closeVideoCall();
  }

  private async handleICECandidateMessage(msg: RTCIceCandidate) {
    const candidate = new RTCIceCandidate(msg);
    console.log('+ addIceCandidate');
    await this.rtcConnection.addIceCandidate(candidate).catch(this.reportError);
  }

  private async requestMediaDevices(): Promise<void> {
    try {
      var media;
      if (this.callType == CallType.VoiceCall) {
        media = {
          audio: true,
          video: false
          // video: { width: 300, height: 300 }
          // video: {width: 1280, height: 720} // 16:9
          // video: {width: 960, height: 540}  // 16:9
          // video: { width: 640, height: 480 }  //  4:3
          // video: {width: 160, height: 120}  //  4:3
        };
        this.localStream = await navigator.mediaDevices.getUserMedia(media);
      }
      else {
        this.localStream = await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
      }

      // pause all tracks
      this.pauseLocalVideo();
    } catch (e) {
      console.error(e);
      alert(`getUserMedia() error: ${e.name}`);
    }
  }

  startLocalVideo(): void {
    this.localStream.getTracks().forEach(track => {
      track.enabled = true;
    });
    this.localVideo.nativeElement.srcObject = this.localStream;
  }

  pauseLocalVideo(): void {
    this.localStream.getTracks().forEach(track => {
      track.enabled = false;
    });
    this.localVideo.nativeElement.srcObject = undefined;
  }

  private createPeerConnection(): void {
    console.log('create peer connection');
    this.rtcConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
          username: '',
          credential: ''
        }
      ]
    });

    this.rtcConnection.onicecandidate = this.handleICECandidateEvent;
    this.rtcConnection.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent;
    this.rtcConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    this.rtcConnection.ontrack = this.handleTrackEvent;
  }

  private closeVideoCall(): void {

    if (this.rtcConnection) {

      this.rtcConnection.ontrack = null;
      this.rtcConnection.onicecandidate = null;
      this.rtcConnection.oniceconnectionstatechange = null;
      this.rtcConnection.onsignalingstatechange = null;

      // Stop all transceivers on the connection
      this.rtcConnection.getTransceivers().forEach(transceiver => {
        transceiver.stop();
      });

      // Close the peer connection
      this.rtcConnection.close();
      this.rtcConnection = null;
    }
  }

  /* ########################  ERROR HANDLER  ################################## */
  private handleGetUserMediaError(e: Error): void {
    switch (e.name) {
      case 'NotFoundError':
        // alert('Unable to open your call because no camera and/or microphone were found.');
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        console.log(e);
        // alert('Error opening your camera and/or microphone: ' + e.message);
        break;
    }

    this.closeVideoCall();
  }

  private reportError = (e: Error) => {
    console.log('got Error: ' + e.name);
    console.log(e);
  }

  /* ########################  EVENT HANDLER  ################################## */
  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      console.log('+ send iceCandidate');
      this.sendSignal({ type: SignalType.iceCandidate, data: event.candidate });
    }
  }

  private handleICEConnectionStateChangeEvent = (event: Event) => {
    switch (this.rtcConnection.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
  }

  private handleSignalingStateChangeEvent = (event: Event) => {
    switch (this.rtcConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  private handleTrackEvent = (event: RTCTrackEvent) => {
    this.remoteVideo.nativeElement.srcObject = event.streams[0];
  }

  private sendSignal(signal: Signal) {
    return this.signalRService.sendSignal(signal, this.partner.userId);
  }

  onCloseWindow() {
    window.close();
  }
}