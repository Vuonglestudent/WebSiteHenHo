import { Injectable } from '@angular/core';
import { UrlMainService } from './url-main.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../user-components/signup/authentication.service';
import { Feature, FeatureDetail } from '../models/models';
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

  public AddFeature = (feature:Feature) => {
    var path = this.mainUrl;
    var headers = this.authenticationService.GetHeader();

    return this.http.post<any>(path, feature, {headers: headers}).toPromise();
  }

  public AddFeatureContent = (content:FeatureDetail) => {
    var path = this.mainUrl + 'content';
    var headers = this.authenticationService.GetHeader();
    return this.http.post<any>(path, content, {headers: headers}).toPromise();
  }

  public UpdateFeature = (updateFeature:Feature) => {
    var path = this.mainUrl;
    var headers = this.authenticationService.GetHeader();

    return this.http.put<any>(path, updateFeature, {headers: headers}).toPromise();
  }

  public UpdateFeatureContent = (updateContent:FeatureDetail) => {
    var path = this.mainUrl + 'content';
    var headers = this.authenticationService.GetHeader();
    return this.http.put<any>(path, updateContent, {headers: headers}).toPromise();
  }

  public DeleteFeature = (featureId:number) => {
    var path = this.mainUrl + featureId;
    var headers = this.authenticationService.GetHeader();

    return this.http.delete<any>(path, {headers: headers}).toPromise();
  }

  public DeleteFeatureContent = (contentId: number) => {
    var path = this.mainUrl + 'content/' + contentId;
    var headers = this.authenticationService.GetHeader();
    return this.http.delete<any>(path, {headers: headers}).toPromise();
  }

}
