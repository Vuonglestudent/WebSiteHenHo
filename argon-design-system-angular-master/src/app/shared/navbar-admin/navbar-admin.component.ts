import { AuthenticationService } from './../../signup/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) { }

  urlStatistic = false;
  urlManagerUser = false;

  ngOnInit(): void {
    var url = this.router.url.split("/")[1];
    if (url === 'statistic') {
      this.urlStatistic = true;
    } else if (url === 'manager-user') {
      this.urlManagerUser = true;
    }
  }

  clickMyProfile = () => {
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.router.navigate(['/profile', this.authenticationService.UserInfo.Id]);
  }

  clickMessage = () => {
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.router.navigate(['/friendlist']);
  }

  clickStatistic = () => {
    this.urlStatistic = true;
    this.urlManagerUser = false;
    this.router.navigate(['/statistic']);
  }

  clickManagerUser = () => {
    this.urlStatistic = false;
    this.urlManagerUser = true;
    this.router.navigate(['/manager-user']);
  }

  clickHome = () => {
    this.urlManagerUser = false;
    this.urlStatistic = false;
    this.router.navigate(['/home'])
  }
}
