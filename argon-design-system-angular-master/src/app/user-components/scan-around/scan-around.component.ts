import { AlertService } from "src/app/shared/_alert";
import { IFindAround, IUserInfo, UserDisplay } from "./../../models/models";
import { AuthenticationService } from "./../../shared/service/authentication.service";
import { UsersService } from "./../../shared/service/users.service";
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { GeolocationService } from "@ng-web-apis/geolocation";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { Router } from "@angular/router";
@Component({
  selector: "app-scan-around",
  templateUrl: "./scan-around.component.html",
  styleUrls: ["./scan-around.component.scss"],
})
export class ScanAroundComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly geolocationService: GeolocationService,
    private usersService: UsersService,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.authService.userInfoObservable.subscribe((data) => {
      if (data != undefined) {
        this.userInfo = data;
        this.findAround.userId = this.userInfo.id;
        this.getPosition();
      }
    });
  }
  faSpinner = faSpinner;
  ngAfterViewInit(): void {
    this.modal.nativeElement.click();
  }

  @ViewChild("openSearchModal") modal: ElementRef<HTMLElement>;

  userInfo: IUserInfo = {} as IUserInfo;

  ngOnInit(): void {}

  isSubscribe = false;
  onCLickUser(userId: string) {
    this.router.navigate(["/profile", userId]);
  }
  getPosition() {
    this.geolocationService.subscribe(
      (position) => {
        if (!this.isSubscribe) {
          console.log(position);
          this.savePosition(
            position.coords.latitude,
            position.coords.longitude
          );
        }
        this.isSubscribe = true;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  savePosition(latitude: number, longitude: number) {
    this.usersService
      .SavePosition(this.userInfo.id, latitude, longitude)
      .subscribe(
        (data) => {
          console.log("saved successful");
        },
        (err) => {
          console.log(err.error.message);
        }
      );
  }

  onChangeSelect(event: any) {
    this.findAround.ageGroup = event.target.value;
  }

  onChangeRadioButton(event: any) {
    this.findAround.gender = event.target.value;
  }

  onChangeNumber(event: any) {
    this.findAround.distance = Number(event.target.value);
  }

  isSearch = false;

  findAround: IFindAround = {
    pageIndex: 1,
    pageSize: 6,
    gender: 0,
    ageGroup: -1,
    distance: 20,
  } as IFindAround;

  users: UserDisplay[] = new Array();
  isLoadingMore = false;
  isFinalPage = false;

  onSearch() {
    this.users = [];
    this.findAround.pageIndex = 1;
    this.isSearch = true;
    this.isLoadingMore = true;
    console.log(this.findAround);
    this.usersService.FindAround(this.findAround).subscribe(
      (data) => {
        setTimeout(() => {
          this.isLoadingMore = false;
          this.isSearch = false;
          if (data.length == 0) {
            this.isFinalPage = true;
            this.alertService.warn("Bạn đã đến trang cuối cùng");
            return;
          }
          this.users = this.users.concat(data);
        }, 1500);
      },
      (err) => {
        this.isLoadingMore = false;
        this.isSearch = false;
        alert(err);
      }
    );
  }

  onMore() {
    this.findAround.pageIndex += 1;
    this.onSearch();
  }
}
