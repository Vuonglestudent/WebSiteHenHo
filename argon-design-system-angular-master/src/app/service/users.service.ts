import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "../signup/authentication.service";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
    ) { }

  private mainUrl = "http://localhost:5000/api/users";

  public GetPagingUsers = (pageIndex: number, pageSize: number) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/pagingUsers?PageIndex=${pageIndex}&PageSize=${pageSize}`;

    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
  };

  public ChangePassword = (email: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
    let headers = this.authenticationService.GetHeader();
    var path = "/changePassword";
    var data = new FormData();
    data.append("Email", email);
    data.append("OldPassword", oldPassword);
    data.append("NewPassword", newPassword);
    data.append("ConfirmPassword", confirmPassword);

    return this.http.put<any>(this.mainUrl + path, data,{headers}).toPromise();
  };

  public Follow = (userId: string) =>{
    let headers = new HttpHeaders();
    headers = this.authenticationService.GetHeader();
    var path = "/follow";
    var data = new FormData();
    data.append("userId", userId);
    console.log("userId: " + userId);
    return this.http.post<any>(this.mainUrl + path, data, {headers: headers}).toPromise();
  }

  public Favorite = (userId: string) =>{
    let headers = this.authenticationService.GetHeader();
    var path = "/favorite";
    var data = new FormData();
    data.append("userId", userId);

    return this.http.post<any>(this.mainUrl + path, data, {headers: headers}).toPromise();
  }

  public GetById = (userId:string) =>{
    var path = `/${userId}`;
    
    return this.http.get<any>(this.mainUrl + path).toPromise();
  }

  public GetFollowers = (userId: string) =>{
    let headers = this.authenticationService.GetHeader();
    var path = `/follow/${userId}`;

    return this.http.get<any>(this.mainUrl + path, {headers}).toPromise();
  }

  public GetFavoritors = (userId: string) =>{
    let headers = this.authenticationService.GetHeader();
    var path = `/favorite/${userId}`;

    return this.http.get<any>(this.mainUrl + path, {headers}).toPromise();
  }

  public GetFavoritest = (pageIndex:number, pageSize: number) =>{
    let headers = this.authenticationService.GetHeader();
    var path = `/favoritest?PageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
  }

  public GetNewUsers = (pageIndex:number, pageSize: number) =>{
    let headers = this.authenticationService.GetHeader();
    var path = `/newUsers?PageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
  }
}
