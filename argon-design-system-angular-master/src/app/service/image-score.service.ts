import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageScore } from '../models/models';
import { AuthenticationService } from '../user-components/signup/authentication.service';
import { UrlMainService } from './url-main.service';

@Injectable({
  providedIn: 'root'
})
export class ImageScoreService {

  constructor(
    private authenticationService: AuthenticationService,
    private url: UrlMainService,
    private http: HttpClient,
  ) { }

  private mainUrl = `${this.url.urlHost}/api/v1/DetectImages/`;

  public GetImageScore() {
    var headers = this.authenticationService.GetHeader();
    return this.http.get<any>(this.mainUrl, { headers: headers }).toPromise();
  }

  public UpdateImageScore(imageScore: ImageScore) {
    var headers = this.authenticationService.GetHeader();

    var data = new FormData();
    data.append("Active", imageScore.active.toString());
    data.append("AutoFilter", imageScore.autoFilter.toString());
    data.append("Hentai", imageScore.hentai.toString());
    data.append("Porn", imageScore.porn.toString());
    data.append("Sexy", imageScore.sexy.toString());

    return this.http.put<any>(this.mainUrl, data, { headers: headers }).toPromise();
  }
}
