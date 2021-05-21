import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as path from 'path';
import { AuthenticationService } from './authentication.service';
import { UrlMainService } from './url-main.service';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {


  constructor(
    private url: UrlMainService,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  private mainUrl = `${this.url.urlHost}/api/v1/access/`;


  public getAccessCountByMonth(month: number, year: number){
    var dateString = month + '/1/' + year;
    var query = 'byMonth?dateTime='+ dateString;
    var headers = this.authenticationService.GetHeader();

    return this.http.get<any>(this.mainUrl + query, {headers: headers}).toPromise();
  }

  public getAccessCountByYear(year: number){
    var dateString = 1 + '/1/' + year;
    var query = 'byYear?dateTime='+ dateString;
    var headers = this.authenticationService.GetHeader();

    return this.http.get<any>(this.mainUrl + query, {headers: headers}).toPromise();
  }

  public getTheNumberOfNewUsersByMonth(){
    var headers = this.authenticationService.GetHeader();
    var path = 'getTheNumberOfNewUsersByMonth'
    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise()
  }

  public GetNumberOfActiveUsers(){
    var headers = this.authenticationService.GetHeader();
    var path = 'getNumberOfActiveUsers'
    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise()
  }
  public GetTheAccountNumberOfEachType(){
    var headers = this.authenticationService.GetHeader();
    var path = 'getTheAccountNumberOfEachType'
    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise()
  }
}
