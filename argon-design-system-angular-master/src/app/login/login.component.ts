import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../signup/authentication.service';
import { faSpinner, faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AlertService } from '../_alert';
import {User} from '../Models/Models';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    protected alertService: AlertService
  ) { }

  options = {
    autoClose: false,
    keepAfterRouteChange: false
  };

  ngOnInit() {
  }

  Index = 1;
  Duration = new Date();

  focus;
  focus1;

  //icon
  faSpinner = faSpinner;
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;
  //

  Loading = false;
  IsValid = true;

  UserData: User;


  onSubmit(f: NgForm) {
    if (f.value.Email == "" || f.value.Password == "") {
      this.alertService.clear();
      this.alertService.warn("Vui lòng nhập đầy đủ thông tin!", this.options);
      return;
    }

    this.Loading = true;
    // this.authenticationService.Login(f.value.Email, f.value.Password)
    //   .then(response => {
    //     console.log(response);
    //     //alert("Login success!");
    //     this.Loading = false;
    //     var userInfo = {
    //       UserName: response.userName,
    //       FullName: response.fullName,
    //       Email: response.email,
    //       token: response.token
    //     };
    //     // Put the object into storage
    //     localStorage.setItem('UserInfo', JSON.stringify(userInfo));
        
    //     // Retrieve the object from storage
    //     var GetUserInfo = localStorage.getItem('UserInfo');
    //     var outPut = JSON.parse(GetUserInfo);
    //     console.log(outPut);
    //     //this.alertService.success('Success!!', this.options);
    //     this.router.navigateByUrl('/home');
    //   })
    //   .catch(error => {
    //     console.log(error.error);
    //     this.alertService.clear();
    //     this.alertService.error(error.error.message, this.options);
    //     this.Loading = false;
    //   })
    this.Loading = false;
        var userInfo = {
          UserName: 'vuong',
          FullName: 'vuong',
          Email: 'vuongvaba1v2@gmail.com',
          token: '123213213'
        };
        // Put the object into storage
        localStorage.setItem('UserInfo', JSON.stringify(userInfo));
        
        // Retrieve the object from storage
        var GetUserInfo = localStorage.getItem('UserInfo');
        var outPut = JSON.parse(GetUserInfo);
        console.log(outPut);
        //this.alertService.success('Success!!', this.options);
        this.router.navigateByUrl('/home');
  }

  confirmEmail(f: NgForm) {
    console.log(f.value.Email);
    if (!this.validateEmail(f.value.Email)) {
      this.alertService.clear();
      this.alertService.warn("Email không hợp lệ, vui lòng nhập lại!");
      return;
    }
    this.Loading = true;

    this.authenticationService.ForgotPasswordRequest(f.value.Email)
      .then(response => {
        this.Loading = false;
        this.UserData = new User();
        console.log(response);
        this.alertService.clear();
        this.alertService.success(response.message, this.options);
        this.UserData.Email = response.userData.email;
        this.UserData.FullName = response.userData.fullName;
        this.UserData.AvatarPath = response.userData.avatarPath;
        this.UserData.HasAvatar = response.userData.hasAvatar;
        console.log(this.UserData);
        this.Index = 3;
      })
      .catch(error => {
        this.Loading = false;
        console.log(error);
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
        
      })
  }

  confirmCode(f: NgForm) {
    console.log(f.value.Code);
    console.log(f.value.NewPassword);
    console.log(f.value.ConfirmPassword);
    
    if(this.Loading){
      return;
    }

    if(f.value.Code == "" || f.value.NewPassword == "" || f.value.ConfirmPassword == ""){
      this.alertService.clear();
      this.alertService.warn("Vui lòng nhập đầy đủ thông tin!", this.options);
      return;
    }

    if(f.value.NewPassword != f.value.ConfirmPassword){
      this.alertService.clear();
      this.alertService.warn("Xác nhận mật khẩu không chính xác, vui lòng nhập lại!", this.options);
      return;
    }

    if(this.UserData == null || this.UserData.Email == ""){
      this.alertService.clear();
      this.alertService.warn("Nhập email của bạn!", this.options);
      this.Index = 2;
      return;
    }

    this.Loading = true;

    this.authenticationService.CodeValidation(f.value.Code, this.UserData.Email, f.value.NewPassword)
      .then(response =>{
        this.Loading = false;
        this.alertService.clear();
        this.alertService.success("Mật khẩu đã được thay đổi thành công, vui lòng đăng nhập!", this.options);
        this.Index = 1;
      })
      .catch(error =>{
        this.Loading = false;
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      })
  }

  cancelClick() {
    this.Index = 1;
  }

  ClickForgot() {
    this.Index = 2;
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}