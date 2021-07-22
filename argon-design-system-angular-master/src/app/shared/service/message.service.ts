import { ChatFriend } from "./../../models/models";
import { UrlMainService } from "./url-main.service";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as path from "path";
import { AuthenticationService } from "./authentication.service";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class MessageService {
  private friendList = new Array<ChatFriend>();
  private friendListSub = new BehaviorSubject<ChatFriend[]>(undefined);
  public friendListObservable = this.friendListSub.asObservable();

  public setFriendList(chatFriend: ChatFriend[]) {
    this.friendList = chatFriend;
    this.friendListSub.next(this.friendList);
  }

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private url: UrlMainService
  ) {}

  // public onlineCount:number = 0;
  private mainUrl = `${this.url.urlHost}/api/v1/chats`;

  public SendMessage = (
    senderId: string,
    receiveId: string,
    content: string,
    files: File[]
  ) => {
    var headers = this.authenticationService.GetHeader();
    var formData = new FormData();
    formData.append("SenderId", senderId);
    formData.append("ReceiverId", receiveId);
    formData.append("Content", content);

    console.log(senderId, receiveId, content);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        formData.append("Files", element);
      }
    }

    return this.http
      .post(this.mainUrl, formData, { headers: headers })
      .toPromise();
  };

  public moreMessages = (
    PageIndex: number,
    PageSize: number,
    SenderId: string,
    ReceiverId: string
  ) => {
    var query = `?PageIndex=${PageIndex}&PageSize=${PageSize}&SenderId=${SenderId}&ReceiverId=${ReceiverId}`;
    var url = this.mainUrl + "/MoreMessages" + query;
    //console.log(url);
    var headers = this.authenticationService.GetHeader();

    return this.http.get<any>(url, { headers: headers }).toPromise();
  };

  public GetFriendList = (userId: string) => {
    var headers = this.authenticationService.GetHeader();
    var path = `/friends/${userId}`;
    return this.http
      .get<any>(this.mainUrl + path, { headers: headers })
      .toPromise();
  };

  public GetChatFriend = (userId: string, friendId: string) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/chatFriend`;
    var query = `?userId=${userId}&friendId=${friendId}`;

    return this.http
      .get<any>(this.mainUrl + path + query, { headers: headers })
      .toPromise();
  };
}
