import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) { }

  private mainUrl = "http://localhost:5000/api/users";

  public GetPagingUsers = (pageIndex: number, pageSize: number) => {
    var path = `/pagingUsers?PageIndex=${pageIndex}&PageSize=${pageSize}`;

    return this.http.get<any>(this.mainUrl + path).toPromise();
  };

  public ChangePassword = (
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    var path = "/changePassword";
    var data = new FormData();
    data.append("Email", email);
    data.append("OldPassword", oldPassword);
    data.append("NewPassword", newPassword);
    data.append("ConfirmPassword", confirmPassword);

    return this.http.put<any>(this.mainUrl + path, data).toPromise();
  };

  public Follow = (userId: string) =>{
    var path = "/follow";
    var data = new FormData();
    data.append("userId", userId);

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public Favorite = (userId: string) =>{
    var path = "/favorite";
    var data = new FormData();
    data.append("userId", userId);

    return this.http.post<any>(this.mainUrl + path, data).toPromise();
  }

  public GetById = (userId:string) =>{
    var path = `/${userId}`;
    
    return this.http.get<any>(this.mainUrl + path).toPromise();
  }

  public GetFollowers = (userId: string) =>{
    var path = `/follow/${userId}`;

    return this.http.get<any>(this.mainUrl + path).toPromise();
  }

  public GetFavoritors = (userId: string) =>{
    var path = `/favorite/${userId}`;

    return this.http.get<any>(this.mainUrl + path).toPromise();
  }
}
