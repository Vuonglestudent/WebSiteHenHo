import { UrlMainService } from "./url-main.service";
import {
  FeatureVM,
  IFindAround,
  ImageUser,
  IUserInfo,
  ProfileData,
  User,
} from "../../models/models";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthenticationService } from "./authentication.service";
import { ThemeService } from "ng2-charts";
@Injectable({
  providedIn: "root",
})
export class UsersService {
  userInfo: IUserInfo;
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private url: UrlMainService
  ) {
    this.authenticationService.userInfoObservable.subscribe(
      (user) => (this.userInfo = user)
    );
  }

  private mainUrl = `${this.url.urlHost}/api/v1/users`;

  public NewUsers: User[] = new Array();

  public Favoritors: User[] = new Array();
  public FavoritePage: any = {
    index: 1,
    size: 12,
    total: 0,
    current: 1,
    position: 1,
  };
  public IsGetSimilarityUsers = false;
  //public imageUsers: ImageUser[] = new Array();

  public SearchFriendByName(name: string) {
    let headers = this.authenticationService.GetHeader();
    var path = `/friends?name=${name}`;

    return this.http.get<any>(this.mainUrl + path, { headers: headers });
  }

  public GetDisplayUserById(userId: string) {
    let headers = this.authenticationService.GetHeader();
    var path = `/display/${userId}`;

    return this.http
      .get<any>(this.mainUrl + path, { headers: headers })
      .toPromise();
  }

  public GetPagingUsers = (pageIndex: number, pageSize: number) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/pagingUsers?PageIndex=${pageIndex}&PageSize=${pageSize}`;

    return this.http
      .get<any>(this.mainUrl + path, { headers: headers })
      .toPromise();
  };

  public ChangePassword = (
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    let headers = this.authenticationService.GetHeader();
    var path = "/changePassword";
    var data = new FormData();
    data.append("Email", email);
    data.append("OldPassword", oldPassword);
    data.append("NewPassword", newPassword);
    data.append("ConfirmPassword", confirmPassword);

    return this.http
      .put<any>(this.mainUrl + path, data, { headers })
      .toPromise();
  };

  public Follow = (userId: string) => {
    let headers = new HttpHeaders();
    headers = this.authenticationService.GetHeader();
    var path = "/follow";
    var data = new FormData();
    data.append("userId", userId);
    console.log("userId: " + userId);
    return this.http
      .post<any>(this.mainUrl + path, data, { headers: headers })
      .toPromise();
  };

  public Favorite = (userId: string) => {
    let headers = this.authenticationService.GetHeader();
    var path = "/favorite";
    var data = new FormData();
    data.append("userId", userId);

    return this.http
      .post<any>(this.mainUrl + path, data, { headers: headers })
      .toPromise();
  };

  public GetById = (userId: string) => {
    var path = `/${userId}`;
    var headers = this.authenticationService.GetHeader();
    return this.http
      .get<any>(this.mainUrl + path, { headers: headers })
      .toPromise();
  };

  public GetFollowers = (
    userId: string,
    pageIndex: number,
    pageSize: number
  ) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/follow/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http.get<any>(this.mainUrl + path, { headers }).toPromise();
  };

  public GetFavoritors = (userId: string) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/favorite/${userId}`;

    return this.http.get<any>(this.mainUrl + path, { headers }).toPromise();
  };

  public GetFavoritest = (pageIndex: number, pageSize: number) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/favoritest?PageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http
      .get<any>(this.mainUrl + path, { headers: headers })
      .toPromise();
  };

  public GetNewUsers = (pageIndex: number, pageSize: number) => {
    let headers = this.authenticationService.GetHeader();
    var path = `/newUsers?PageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http
      .get<any>(this.mainUrl + path, { headers: headers })
      .toPromise();
  };

  public ProfileData: ProfileData = new ProfileData();
  public GetProfileData = () => {
    let headers = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/Profiles/features`;
    return this.http.get<any>(path, { headers: headers }).toPromise();
  };
  public UpdateProfile = (
    profile: User,
    features: FeatureVM[],
    searchFeatures: FeatureVM[]
  ) => {
    var headers = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/Profiles`;

    profile.features = features;
    profile.searchFeatures = searchFeatures;

    return this.http.put<any>(path, profile, { headers: headers }).toPromise();
  };

  public UpdateAvatar = (file: any) => {
    var headers = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/Users/avatar`;

    var data = new FormData();
    data.append("Avatar", file);
    data.append("UserId", this.userInfo.id);

    return this.http.put<any>(path, data, { headers: headers }).toPromise();
  };

  public FilterUsers = (
    feature: string,
    isAscending: boolean,
    pageIndex: number,
    pageSize: number
  ) => {
    var headers = this.authenticationService.GetHeader();
    var query = `${this.url.urlHost}/api/v1/Users/filterUsers?Feature=${feature}&IsAscending=${isAscending}&PageIndex=${pageIndex}&pageSize=${pageSize}`;

    return this.http.get<any>(query, { headers: headers }).toPromise();
  };

  public GetSimilarUSer = (
    userId: string,
    pageIndex: string,
    pageSize: string,
    isFilter: boolean,
    location: string,
    fullName: string,
    ageGroup: any,
    gender: any
  ) => {
    if (isFilter) {
      if (gender.length > 3) {
        gender = gender.slice(4, gender.length);
      }
    }
    var headers = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/Profiles/similar/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}&IsFilter=${isFilter}&Location=${location}&FullName=${fullName}&ageGroup=${ageGroup}&gender=${gender}`;
    return this.http.get<any>(path, { headers: headers }).toPromise();
  };

  public FilterFeatures = (
    features: Array<any>,
    pageIndex: number,
    pageSize: number
  ) => {
    var headers = this.authenticationService.GetHeader();

    var path = `${this.url.urlHost}/api/v1/Profiles/filterFeatures?PageIndex=${pageIndex}&PageSize=${pageSize}`;

    return this.http
      .post<any>(path, features, { headers: headers })
      .toPromise();
  };

  public DisableUser = (userId: string) => {
    var headers = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/Users/block/${userId}`;
    var data = new FormData();

    return this.http.post<any>(path, data, { headers: headers }).toPromise();
  };

  public BlockUser = (userId: string) => {
    var headers = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/Users/blackList/${userId}`;
    var data = new FormData();

    return this.http.post<any>(path, data, { headers: headers }).toPromise();
  };

  public GetBlockList = () => {
    let headers = this.authenticationService.GetHeader();
    var path = `/blackList`;

    return this.http.get<any>(this.mainUrl + path, { headers }).toPromise();
  };

  public CreateRelationship(
    fromId: string,
    toId: string,
    relationShipType: number
  ) {
    let header = this.authenticationService.GetHeader();
    var path = `${this.url.urlHost}/api/v1/relationships`;

    var data = {
      fromId,
      toId,
      relationShipType,
    };
    return this.http.post<any>(path, data, { headers: header });
  }

  public SavePosition(userId: string, latitude: number, longitude: number) {
    let header = this.authenticationService.GetHeader();
    var path = this.mainUrl + "/position";

    return this.http.put<any>(
      path,
      { userId, latitude, longitude },
      { headers: header }
    );
  }

  public FindAround(findAround: IFindAround) {
    let header = this.authenticationService.GetHeader();
    var path = this.mainUrl + "/around";

    return this.http.post<any>(path, findAround, { headers: header });
  }
}
