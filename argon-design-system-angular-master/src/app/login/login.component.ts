import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../signup/authentication.service';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AlertService } from '../_alert';
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

  focus;
  focus1;

  //icon
  faSpinner = faSpinner;
  faCheck = faCheck;
  //

  Loading = false;
  IsValid = true;

  ngOnInit() {
  }
  onSubmit(f: NgForm) {
    if (f.value.Email == "" || f.value.Password == "") {
      this.alertService.warn("Vui lòng nhập đầy đủ thông tin!", this.options);
      return;
    }

    this.Loading = true;
    this.authenticationService.Login(f.value.Email, f.value.Password)
      .then(response => {
        console.log(response);
        //alert("Login success!");
        this.Loading = false;
        //this.alertService.success('Success!!', this.options);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.log(error.error);
        this.alertService.error(error.error.message, this.options);
        this.Loading = false;
      })
  }
}