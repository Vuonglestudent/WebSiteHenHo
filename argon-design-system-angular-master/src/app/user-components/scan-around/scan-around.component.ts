import { IUserInfo } from './../../models/models';
import { AuthenticationService } from './../../shared/service/authentication.service';
import { UsersService } from './../../shared/service/users.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';

@Component({
  selector: 'app-scan-around',
  templateUrl: './scan-around.component.html',
  styleUrls: ['./scan-around.component.css']
})
export class ScanAroundComponent implements OnInit, AfterViewInit {

  constructor(
    private readonly geolocationService: GeolocationService,
    private usersService: UsersService,
    private authService: AuthenticationService
  ) {
    this.authService.userInfoObservable
      .subscribe(data => {
        if (data != undefined) {
          this.userInfo = data;
          this.getPosition();
        }

      })
  }
  ngAfterViewInit(): void {
    this.modal.nativeElement.click();
  }

  @ViewChild('openSearchModal') modal: ElementRef<HTMLElement>;

  userInfo: IUserInfo = {} as IUserInfo;

  ngOnInit(): void {

  }

  isSubscribe = false;

  getPosition() {
    this.geolocationService.subscribe(position => {

      if (!this.isSubscribe) {
        console.log(position);
        this.savePosition(position.coords.latitude, position.coords.longitude);
      }
      this.isSubscribe = true;
    }, err => {
      console.log(err);
    })
  }

  savePosition(latitude: number, longitude: number) {
    this.usersService.SavePosition(this.userInfo.id, latitude, longitude)
      .subscribe(data => {
        console.log('saved successful');
      }, err => {
        console.log(err.error.message);
      })
  }


  oldGroup = 0;
  gender = 0;
  radius = 5;

  onChangeSelect(event: any) {
    console.log(event.target.value);
    this.oldGroup = event.target.value;
  }

  onChangeRadioButton(event: any) {
    console.log(event.target.value);
    this.gender = event.target.value;
  }

  onChangeNumber(event: any) {
    console.log(event.target.value);
    let numb = event.target.value;
  }

  isSearch = false;

  pageIndex = 1;
  pageSize = 6;
  onSearch() {
    this.isSearch = true;

  }
}

export interface IFindAround {
  pageIndex: number;
  pageSize: number;
  userId: string;
  distance: number;
  latitude: number;
  longitude: number;
  gender: number;
  ageGroup: number;
}