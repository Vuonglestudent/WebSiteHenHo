import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../service/users.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { AlertService } from '../../_alert';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private usersService: UsersService,
    http: HttpClient,
    private router: Router,
    protected alertService: AlertService
  ) { }

  ngOnInit(): void { }

  //icon
  faSpinner = faSpinner;
  faCheck = faCheck;
  //

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

    var GetUserInfo = localStorage.getItem('UserInfo');
    console.log(GetUserInfo);
    if (GetUserInfo == "" || GetUserInfo == undefined) {
      this.router.navigateByUrl('login');
    }

    var outPut = JSON.parse(GetUserInfo);


    this.usersService.ChangePassword(outPut.Email, f.value.OldPassword, f.value.NewPassword, f.value.ConfirmPassword)
      .then(response => {
        this.alertService.clear();
        this.alertService.success(response.message, this.options);
        setTimeout(() => {
          this.router.navigateByUrl('/home');

      }, 3000);
      })
      .catch(error => {
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      });
  }
}
