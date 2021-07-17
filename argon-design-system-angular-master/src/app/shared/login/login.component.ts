import { UsersService } from "./../service/users.service";
import { IUserInfo } from "../../models/models";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthenticationService } from "../service/authentication.service";
import {
  faSpinner,
  faCheck,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { AlertService } from "../_alert";
import { User, SocialUser } from "../../models/models";
import { SocialAuthService } from "angularx-social-login";
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from "angularx-social-login";
import { from } from "rxjs";
import { slideInOutAnimation } from "../_animates/animates";
import { GeolocationService } from "@ng-web-apis/geolocation";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [slideInOutAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  host: { "[@slideInOutAnimation]": "" },
})
export class LoginComponent implements OnInit {
  userInfo: IUserInfo;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    protected alertService: AlertService,
    private authService: SocialAuthService,
    private usersService: UsersService,
    private readonly geolocationService: GeolocationService
  ) {
    this.authenticationService.userInfoObservable.subscribe((user) => {
      if (user != undefined) {
        this.userInfo = user;
        this.getPosition();
      }
    });
  }

  options = {
    autoClose: false,
    keepAfterRouteChange: false,
  };

  ngOnInit() {}

  user: SocialUser;
  public loggedIn: boolean;

  Index = 1;
  Duration = new Date();

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
    this.authenticationService
      .Login(f.value.Email, f.value.Password)
      .then((response) => {
        this.Loading = false;
        this.userInfo = response;

        this.authenticationService.setUserInfo(this.userInfo);

        this.alertService.clear();
        this.alertService.success("Success!!", this.options);

        if (!this.userInfo.isInfoUpdated) {
          this.router.navigate(["/profile", this.userInfo.id]);
          return;
        }
        if (this.userInfo.role == "User") {
          this.router.navigateByUrl("/home");
        } else if (this.userInfo.role == "Admin") {
          // this.router.navigateByUrl("/statistic");
          this.router.navigateByUrl("/home");
        }
      })
      .catch((error) => {
        console.log(error.error);
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
        this.Loading = false;
      });
  }

  confirmEmail(f: NgForm) {
    console.log(f.value.Email);
    if (!this.validateEmail(f.value.Email)) {
      this.alertService.clear();
      this.alertService.warn("Email không hợp lệ, vui lòng nhập lại!");
      return;
    }
    this.Loading = true;

    this.authenticationService
      .ForgotPasswordRequest(f.value.Email)
      .then((response) => {
        this.Loading = false;
        this.UserData = new User();
        console.log(response);
        this.alertService.clear();
        this.alertService.success(response.message, this.options);
        this.UserData.email = response.userData.email;
        this.UserData.fullName = response.userData.fullName;
        this.UserData.avatarPath = response.userData.avatarPath;
        this.UserData.hasAvatar = response.userData.hasAvatar;
        console.log(this.UserData);
        this.Index = 3;
      })
      .catch((error) => {
        this.Loading = false;
        console.log(error);
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      });
  }

  confirmCode(f: NgForm) {
    if (this.Loading) {
      return;
    }

    if (
      f.value.Code == "" ||
      f.value.NewPassword == "" ||
      f.value.ConfirmPassword == ""
    ) {
      this.alertService.clear();
      this.alertService.warn("Vui lòng nhập đầy đủ thông tin!", this.options);
      return;
    }

    if (f.value.NewPassword != f.value.ConfirmPassword) {
      this.alertService.clear();
      this.alertService.warn(
        "Xác nhận mật khẩu không chính xác, vui lòng nhập lại!",
        this.options
      );
      return;
    }

    if (this.UserData == null || this.UserData.email == "") {
      this.alertService.clear();
      this.alertService.warn("Nhập email của bạn!", this.options);
      this.Index = 2;
      return;
    }

    this.Loading = true;

    this.authenticationService
      .CodeValidation(f.value.Code, this.UserData.email, f.value.NewPassword)
      .then((response) => {
        this.Loading = false;
        this.alertService.clear();
        this.alertService.success(
          "Mật khẩu đã được thay đổi thành công, vui lòng đăng nhập!",
          this.options
        );
        this.Index = 1;
      })
      .catch((error) => {
        this.Loading = false;
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      });
  }

  cancelClick() {
    this.Index = 1;
  }

  ClickForgot() {
    this.Index = 2;
  }

  validateEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  saveInfo() {
    this.authenticationService
      .FacebookLogin(this.user)
      .then((response) => {
        this.loggedIn = true;
        this.userInfo = response;
        this.authenticationService.setUserInfo(this.userInfo);
        // Put the object into storage
        if (!this.userInfo.isInfoUpdated) {
          this.router.navigate(["/profile", this.userInfo.id]);
        }
        if (this.userInfo.role == "User") {
          this.router.navigateByUrl("/home");
        } else if (this.userInfo.role == "Admin") {
          this.router.navigateByUrl("/statistic");
        }
      })
      .catch((error) => {
        this.loggedIn = false;
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.user = data;
      this.saveInfo();
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.saveInfo();
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  isSubscribe = false;

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
}
