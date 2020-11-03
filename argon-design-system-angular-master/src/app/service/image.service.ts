import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../signup/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  private mainUrl = "http://localhost:5000/api/Images";
  public getImageByUserId = (userId: string) =>{
    var path = `user/${userId}`;
    var headers = this.authenticationService.GetHeader();
    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
  }

  public addImages = (userId:string, imageFiles: any, title: string) =>{
    var path = ``;
    var formData = new FormData();
    formData.append("UserId", userId);

    formData.append("Title", title);

    imageFiles.forEach(file => {
      formData.append("Images", file);
    });

    var headers = this.authenticationService.GetHeader();
    return this.http.post<any>(this.mainUrl + path, formData, {headers: headers}).toPromise();
  }

}
