import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UrlMainService } from 'src/app/service/url-main.service';
import { AuthenticationService } from 'src/app/user-components/signup/authentication.service';
import { SubscribeService } from 'src/app/service/subscribe.service';
import { faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';
@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    test : Date = new Date();
    constructor(
      private router: Router,
      private urlMainService: UrlMainService, 
      private authenticationService:AuthenticationService,
      private subscribeService: SubscribeService,
      ) {}

    ngOnInit() {

    }
    faSpinner = faSpinner;
    faCheck = faCheck;
    loading = false;
    subscribed = false;
    email: string;
    name:string;
    subscribeStatus = 'Đăng ký để nhận thông tin mới nhất!';
    getPath(){
      return this.router.url;
    }

    Subscribe(){
      this.loading = true;
      console.log(this.email)
      console.log(this.name)
      this.subscribeService.Subscribe(this.email, this.name)
        .then(response =>{
          console.log(response)
          this.loading = false;
          this.subscribeStatus = "Thanks for your subscribe!";
          this.subscribed = true;
        })
        .catch(error => console.log(error))
    }
}
