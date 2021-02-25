import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import {SocialUser} from '../../models/models'
@Component({
  selector: 'app-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.css']
})
export class FacebookLoginComponent implements OnInit, AfterViewInit {

  constructor(
    private authService: SocialAuthService
  ) { }

  ngAfterViewInit(): void {

  }

  user: SocialUser;
  loggedIn: boolean;

  show = false;

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      this.loggedIn = (user != null);
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    console.log(FacebookLoginProvider.PROVIDER_ID)
    this.show = true;

  }

  signOut(): void {
    this.authService.signOut();
  }

}
