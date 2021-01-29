import { Injectable } from '@angular/core';
import { UrlMainService } from './url-main.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../signup/authentication.service';
import { Feature } from '../models/models';
@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private url: UrlMainService
  ) { }

  private mainUrl = `${this.url.urlHost}/api/v1/Features/`;
  public features: Feature[] = new Array();
  public GetFeatures = () => {
    var path = this.mainUrl;
    var headers = this.authenticationService.GetHeader();

    return this.http.get<any>(path, {headers : headers}).toPromise();
  }


}
