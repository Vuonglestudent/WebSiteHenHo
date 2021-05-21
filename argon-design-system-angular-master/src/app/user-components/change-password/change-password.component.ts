import { IUserInfo } from './../../models/models';
import { AuthenticationService } from 'src/app/shared/service/authentication.service';
import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../shared/service/users.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AlertService } from '../../shared/_alert';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  userInfo:IUserInfo;
  constructor(
    private usersService: UsersService,
    http: HttpClient,
    private router: Router,
    protected alertService: AlertService,
    private authenticationService:AuthenticationService
  ) { 
    this.authenticationService.userInfoObservable
      .subscribe(user => this.userInfo = user);
  }

  ngOnInit(): void { }

  //icon
  faSpinner = faSpinner;
  faCheck = faCheck;
  //
  Loading = false;
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  onSubmit(f: NgForm) {
    if (f.value.NewPassword == "" || f.value.NewPassword == "" || f.value.ConfirmPassword == "") {
      this.alertService.warn("Vui lòng nhập đầy đủ thông tin!", this.options);
      return;
    }

    if (f.value.NewPassword != f.value.ConfirmPassword) {
      this.alertService.warn("Xác nhận mật khẩu không chính xác!", this.options);
      return;
    }

    if (this.userInfo == undefined) {
      this.router.navigateByUrl('login');
    }
    this.Loading = true;
    this.usersService.ChangePassword(this.userInfo.email, f.value.OldPassword, f.value.NewPassword, f.value.ConfirmPassword)
      .then(response => {
        this.Loading = false;
        this.alertService.clear();
        this.alertService.success(response.message, this.options);
        setTimeout(() => {
          this.router.navigateByUrl('/home');

      }, 3000);
      })
      .catch(error => {
        this.Loading = false;
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      });
  }
}
