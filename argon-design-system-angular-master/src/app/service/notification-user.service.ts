import { Injectable } from '@angular/core';
import { Message } from '../models/models';
import { UrlMainService } from './url-main.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../user-components/signup/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class NotificationUserService {

  constructor(
    private url: UrlMainService,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  public Notification: Message[] = new Array();

  public pageIndex:number = 1;
  public pageSize: number = 3;
  private mainUrl = `${this.url.urlHost}/api/v1/Notifications/`;

  public GetNotification = (userId: string, pageIndex: number, pageSize: number) =>{
    var path = this.mainUrl + userId + `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    var headers = this.authenticationService.GetHeader();
    return this.http.get<any>(path, {headers: headers}).toPromise();
  }

  public DeleteNotification = (notificationId) =>{
    var path = this.mainUrl+notificationId.toString();

    var headers = this.authenticationService.GetHeader();

    return this.http.delete<any>(path, {headers: headers}).toPromise();
  }
}
