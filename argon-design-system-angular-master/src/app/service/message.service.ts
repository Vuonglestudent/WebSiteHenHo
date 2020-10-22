import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as path from 'path';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient
  ) { }

  private mainUrl = "http://localhost:5000/api/chats";

  public SendMessage = (senderId: string, receiveId: string, content: string) => {

    var formData = new FormData();
    formData.append("SenderId", senderId);
    formData.append("ReceiverId", receiveId);
    formData.append("Content", content);
    return this.http.post(this.mainUrl, formData).toPromise();
  }

  public moreMessages = (PageIndex: number, PageSize: number, SenderId: string, ReceiverId: string) => {
    var query = `?PageIndex=${PageIndex}&PageSize=${PageSize}&SenderId=${SenderId}&ReceiverId=${ReceiverId}`;
    var url = this.mainUrl + '/MoreMessages'+ query;
    console.log(url);
    var data = {
      SenderId: SenderId,
      ReceiverId: ReceiverId
    }
    return this.http.get<any>(url).toPromise();
  }

  public GetFriendList = (userId: string) =>{
    var path = `/friends/${userId}`;
    return this.http.get<any>(this.mainUrl + path).toPromise();
  }
}
