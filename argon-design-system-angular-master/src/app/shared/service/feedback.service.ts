import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFeedback } from 'src/app/models/models';
import { AuthenticationService } from './authentication.service';
import { UrlMainService } from './url-main.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private url: UrlMainService,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  private mainUrl = `${this.url.urlHost}/api/v1/Feedbacks/`;

  public GetFeedbacks = (pageIndex: number, pageSize: number) => {
    var path = this.mainUrl + `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    var headers = this.authenticationService.GetHeader();
    return this.http.get<any>(path, { headers: headers });
  }

  public DeleteFeedbacks = (feedbackId: number) => {
    var path = this.mainUrl + '/' + feedbackId.toString();

    var headers = this.authenticationService.GetHeader();

    return this.http.delete<any>(path, { headers: headers });
  }

  public CreateFeedback(feedback: IFeedback) {

    var headers = this.authenticationService.GetHeader();
    return this.http.post<IFeedback>(this.mainUrl, feedback, { headers: headers });
  }

  public UpdateFeedback(feedback:IFeedback){
    var path = this.mainUrl + '/' +  feedback.id.toString();
    var headers = this.authenticationService.GetHeader();
    return this.http.post<IFeedback>(this.mainUrl, feedback, { headers: headers });
  }
}
