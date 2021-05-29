import { IUserInfo } from '../../models/models';
import { UrlMainService } from './url-main.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SocialUser } from '../../models/models'
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private http: HttpClient,
    private url: UrlMainService
  ) {
    try {
      var info = JSON.parse(localStorage.getItem('userInfo'));
      if (info != null || info != undefined) {
        this.setUserInfo(info);
      }
    } catch (error) {
      localStorage.clear();
    }

  }

  private userInfo: IUserInfo = {} as IUserInfo;

  setUserInfo(userInfo: IUserInfo) {

    if (userInfo != undefined && userInfo != null) {
      this.userInfo = {} as IUserInfo;
      this.userInfo.id = userInfo.id;
      this.userInfo.email = userInfo.email;
      this.userInfo.avatarPath = userInfo.avatarPath;
      this.userInfo.token = userInfo.token;
      this.userInfo.fullName = userInfo.fullName;
      this.userInfo.isInfoUpdated = userInfo.isInfoUpdated;
      this.userInfo.role = userInfo.role;

      localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
      this.userInfoSub.next(this.userInfo);
    }

  }

  removeUserInfo(){
    this.userInfo = null;
    localStorage.clear();
    this.userInfoSub.next(undefined);
  }

  private userInfoSub = new BehaviorSubject<IUserInfo>(undefined);

  public userInfoObservable = this.userInfoSub.asObservable();

  private mainUrl = `${this.url.urlHost}/api/v1/Authenticates`;

  public SignUp = (fullName: string, userName: string, email: string, password: string) => {

    var data = new FormData();
    data.append("Email", email);
    data.append("UserName", userName);
    data.append("Password", password);
    data.append("FullName", fullName);

    var path = `/signUp`;

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public Login = (email: string, password: string) => {
    var data = new FormData();
    data.append("Email", email);
    data.append("Password", password);

    var path = `/login`;

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public ForgotPasswordRequest = (email: string) => {
    var data = new FormData();
    data.append("Email", email);

    var path = '/forgotPassword';

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public CodeValidation = (code: string, email: string, newPassword: string) => {
    var data = new FormData();
    data.append("Email", email);
    data.append("Code", code);
    data.append("NewPassword", newPassword);

    var path = '/CodeValidation';

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public FacebookLogin = (account: SocialUser) => {
    var path = '/social';
    var data = new FormData();
    var str = account.photoUrl;

    if(account.provider == "FACEBOOK"){
      var re = /normal/gi;
      var newStr = str.replace(re, "large");
      data.append("Avatar", newStr);
    }
    else{
      data.append("Avatar", str);
    }
    
    data.append("Email", account.email);
    data.append("FullName", account.name);
    data.append("Provider", account.provider);
    

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public Logout = () => {
    let headers = this.GetHeader();
    var path = '/logout';
    return this.http.post<any>(this.mainUrl + path, null, { headers }).toPromise();
  }

  public ValidateToken = () => {
    var path = '/validateToken';
    var headers = new HttpHeaders();
    headers = this.GetHeader();
    return this.http.post<any>(this.mainUrl + path, null, { headers: headers }).toPromise();
  }

  public GetHeader = (): HttpHeaders => {
    let headers: HttpHeaders = new HttpHeaders();
    if (this.userInfo != null) {
      headers = headers.append('Authorization', `Bearer ${this.userInfo.token}`);
    }
    return headers;
  }
}