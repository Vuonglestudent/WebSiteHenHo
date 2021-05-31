import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  private isVideoOn: boolean = true;
  private isVideoOnSub = new BehaviorSubject<boolean>(true);
  public isVideoOnObservable = this.isVideoOnSub.asObservable();

  public toggleVideo(){
    this.isVideoOn = !this.isVideoOn;
    console.log('next video');
    this.isVideoOnSub.next(this.isVideoOn);
  }

  private isAudioOn: boolean = true;
  private isAudioOnSub = new BehaviorSubject<boolean>(true);
  public isAudioOnObservable = this.isAudioOnSub.asObservable();

  public toggleAudio(){
    this.isAudioOn = !this.isAudioOn;
    console.log('next audio');
    this.isAudioOnSub.next(this.isAudioOn);
  }

  constructor() { }  
}
