import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IRelationship } from "src/app/models/models";
import { AuthenticationService } from "./authentication.service";
import { UrlMainService } from "./url-main.service";

@Injectable({
  providedIn: "root",
})
export class RelationshipService {
  constructor(
    private url: UrlMainService,
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  private mainUrl = `${this.url.urlHost}/api/v1/Relationships`;

  public GetByIds = (fromId: string, toId: string) => {
    var path = this.mainUrl + `?fromId=${fromId}&toId=${toId}`;

    var headers = this.authenticationService.GetHeader();
    return this.http.get<any>(path, { headers: headers });
  };

  public Delete = (userId: number) => {
    var path = this.mainUrl + "/" + userId.toString();

    var headers = this.authenticationService.GetHeader();

    return this.http.delete<any>(path, { headers: headers });
  };

  public Create(relationship: IRelationship) {
    var headers = this.authenticationService.GetHeader();
    return this.http.post<IRelationship>(this.mainUrl, relationship, {
      headers: headers,
    });
  }

  public Accept(id: number) {
    var headers = this.authenticationService.GetHeader();
    var path = this.mainUrl + "/accept/" + id;
    return this.http.post<IRelationship>(path, null, { headers: headers });
  }

  public Decline(id: number) {
    var headers = this.authenticationService.GetHeader();
    var path = this.mainUrl + "/decline/" + id;
    return this.http.post<IRelationship>(path, null, { headers: headers });
  }
}
