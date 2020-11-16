import { User } from './../Models/Models';
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
    var headers = this.authenticationService.GetHeader();
    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
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

  public GetDisplayUser = (userId: string) =>{
    let headers = this.authenticationService.GetHeader();
    var path = `/display/${userId}`;

    return this.http.get<any>(this.mainUrl + path, {headers: headers}).toPromise();
  }

  public GetProfileData = () =>{
    let headers = this.authenticationService.GetHeader();
    var path = "http://localhost:5000/api/Profiles/features";
    return this.http.get<any>(path, {headers: headers}).toPromise();
  }
  public UpdateProfile = (profile:User) =>{
    var headers = this.authenticationService.GetHeader();
    var path = "http://localhost:5000/api/Profiles";
    var data = new FormData();
    data.append("Id", profile.id);
    data.append("FullName", profile.fullName);
    data.append("Gender", profile.gender);
    data.append("Location", profile.profile.location);
    data.append("PhoneNumber", profile.phoneNumber);
    data.append("Job", profile.profile.job);
    data.append("Title", profile.profile.title);
    data.append("Summary", profile.summary);
    data.append("Weight", profile.profile.weight.toString());
    data.append("Height", profile.profile.height.toString());
    data.append("Dob", profile.profile.dob.toString());
    data.append("FindPeople", profile.profile.findPeople);
    data.append("Marriage", profile.profile.marriage);
    data.append("Target", profile.profile.target);
    data.append("Education", profile.profile.education);
    data.append("Body", profile.profile.body);
    data.append("Character", profile.profile.character);
    data.append("LifeStyle", profile.profile.lifeStyle);
    data.append("MostValuable", profile.profile.mostValuable);
    data.append("Religion", profile.profile.religion);
    data.append("FavoriteMovie", profile.profile.favoriteMovie);
    data.append("AtmosphereLike", profile.profile.atmosphereLike);
    data.append("Smoking", profile.profile.smoking);
    data.append("DrinkBeer", profile.profile.drinkBeer);

    return this.http.put<any>(path, data, {headers: headers}).toPromise();
  }
}
