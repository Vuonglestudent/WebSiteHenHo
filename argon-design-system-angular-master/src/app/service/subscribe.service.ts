import { Injectable } from '@angular/core';
import { UrlMainService } from './url-main.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "../user-components/signup/authentication.service";
import * as path from 'path';
@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private url: UrlMainService
  ) { }

  public Subscribe = (email: string, name: string)=>{
    var url = this.url.urlHost + '/api/v1/subscribe';
    var headers = this.authenticationService.GetHeader();
    var data = new FormData();
    data.append("Email", email)
    data.append("Name", name)

    return this.http.post<any>(url, data, {headers: headers}).toPromise();

  }
}
