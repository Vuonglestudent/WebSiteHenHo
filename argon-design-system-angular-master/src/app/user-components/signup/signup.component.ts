import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from './authentication.service';
import { faSpinner, faCheck} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import { AlertService } from '../../_alert';
import { slideInOutAnimation } from '../../_animates/animates';
@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [slideInOutAnimation],
    
    // attach the slide in/out animation to the host (root) element of this component
    host: { '[@slideInOutAnimation]': '' },
})
export class SignupComponent implements OnInit {
    constructor(
        private authenticationService : AuthenticationService,
        private router:Router,
        protected alertService: AlertService
    ) { }

    options = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    test : Date = new Date();
    focus;
    focus1;
    focus2;

    //icon
    faSpinner = faSpinner;
    faCheck = faCheck;
    //
    

    Loading = false;

    ngOnInit() {}

    onSubmit(f: NgForm){
        if(f.value.FullName == "" || f.value.Email == "" || f.value.Password == "" || f.value.ConfirmPassword == "" || f.value.UserName == ""){
          this.alertService.warn("Vui lòng nhập đầy đủ thông tin!", this.options);
          return;
        }

        if(!this.validateEmail(f.value.Email)){
            this.alertService.warn("Email không hợp lệ, vui lòng nhập lại!", this.options);
            return;
        }

        if(f.value.Password != f.value.ConfirmPassword){
            this.alertService.warn("Xác nhận mật khẩu không chính xác!", this.options);
            return;
        }
        this.Loading = true;
        this.authenticationService.SignUp(f.value.FullName, f.value.UserName, f.value.Email, f.value.Password)
            .then(response =>{
                console.log(response);
                this.Loading = false;
                this.alertService.clear();
                this.alertService.success("Tài khoản của bạn đã được tạo, vui lòng xác nhận email của bạn trong hộp thư đến!", this.options);
                setTimeout(() => {
                    //this.router.navigate(['nextRoute']);
                    this.router.navigateByUrl('/login');

                }, 5000);
            })
            .catch(error =>{
                console.log(error);
                this.alertService.error(error.error.message, this.options);
                this.Loading = false;
            })
      }
    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
