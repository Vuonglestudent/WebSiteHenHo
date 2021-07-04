import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IUserInfo } from 'src/app/models/models';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {

  userInfo:IUserInfo;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.userInfoObservable
	  .subscribe(user => this.userInfo = user)
   }
  data: any;
  salesChart;

  urlStatistic = false;
  urlManagerUser = false;
  urlFeatureManger = false;
  urlImageScore = false;


  ngOnInit(): void {
    var url = this.router.url.split("/")[1];
    if (url === 'statistic') {
      this.urlStatistic = true;

      this.urlFeatureManger = false;
      this.urlManagerUser = false;
      this.urlImageScore = false;
    } else if (url === 'manager-user') {
      this.urlManagerUser = true;

      this.urlStatistic = false;
      this.urlFeatureManger = false;
      this.urlImageScore = false;
    } else if (url === 'feature-manager'){
      this.urlFeatureManger = true;

      this.urlStatistic = false;
      this.urlManagerUser = false;
      this.urlImageScore = false;
    }else if(url === 'image-score'){
      this.urlImageScore = true;

      this.urlStatistic = false;
      this.urlFeatureManger = false;
      this.urlManagerUser = false;
    }
  }



  clickMyProfile = () => {
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.urlFeatureManger = false;
    this.router.navigate(['/profile', this.userInfo.id]);
  }

  clickMessage = () => {
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.urlFeatureManger = false;
    this.router.navigate(['/chat']);
  }

  clickStatistic = () => {
    this.urlStatistic = true;
    this.urlManagerUser = false;
    this.urlFeatureManger = false;
    this.urlImageScore = false;
    this.router.navigate(['/statistic']);
  }

  clickManagerUser = () => {
    this.urlStatistic = false;
    this.urlManagerUser = true;
    this.urlFeatureManger = false;
    this.urlImageScore = false;
    this.router.navigate(['/manager-user']);
  }

  clickHome = () => {
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.urlFeatureManger = false;
    this.urlImageScore = false;
    this.router.navigate(['/home'])
  }
  
  clickFeatureManager = () => {
    this.urlFeatureManger = true;
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.urlImageScore = false;
    this.router.navigate(['/feature-manager']);
  }

  clickImageScore = () => {
    this.urlImageScore = true;

    this.urlStatistic = false;
    this.urlFeatureManger = false;
    this.urlManagerUser = false;
    this.router.navigate(['/image-score']);
  }

}
