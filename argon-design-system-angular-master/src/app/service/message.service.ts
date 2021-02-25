import { UrlMainService } from './url-main.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as path from 'path';
import { AuthenticationService } from '../user-components/signup/authentication.service';
import { ChatFriend } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private url: UrlMainService
  ) { }

  public onlineCount:number = 0;
  private mainUrl = `${this.url.urlHost}/api/v1/chats`;

  public SendMessage = (senderId: string, receiveId: string, content: string) => {

    var headers = this.authenticationService.GetHeader();
    var formData = new FormData();
    formData.append("SenderId", senderId);
    formData.append("ReceiverId", receiveId);
    formData.append("Content", content);
    return this.http.post(this.mainUrl, formData, {headers: headers}).toPromise();
  }

  public moreMessages = (PageIndex: number, PageSize: number, SenderId: string, ReceiverId: string) => {
    var query = `?PageIndex=${PageIndex}&PageSize=${PageSize}&SenderId=${SenderId}&ReceiverId=${ReceiverId}`;
    var url = this.mainUrl + '/MoreMessages'+ query;
    console.log(url);
    var headers = this.authenticationService.GetHeader();

    return this.http.get<any>(url, {headers: headers}).toPromise();
  }

  public GetFriendList = (userId: string) =>{
    var headers = this.authenticationService.GetHeader();
    var path = `/friends/${userId}`;
    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
  }

  public GetChatFriend = (userId: string, friendId: string) =>{
    let headers = this.authenticationService.GetHeader();
    var path = `/chatFriend`;
    var query = `?userId=${userId}&friendId=${friendId}`;

    return this.http.get<any>(this.mainUrl + path + query, {headers: headers}).toPromise();
  }

  public friendList = new Array<ChatFriend>();
}
