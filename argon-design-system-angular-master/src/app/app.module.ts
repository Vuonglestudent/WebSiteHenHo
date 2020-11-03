import { SectionsModule } from './sections/sections.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
//import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertModule } from './_alert';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { ChatComponent } from './chat/chat.component';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';
import { FriendListComponent } from './friend-list/friend-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommonModule } from '@angular/common';
import { SeenImageComponent } from './seen-image/seen-image.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    ConfirmEmailComponent,
    FacebookLoginComponent,
    FriendListComponent,
    ChatComponent,
    ChangePasswordComponent,
    HomeComponent,
    SeenImageComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    //HomeModule,
    HttpClientModule,
    FontAwesomeModule,
    AlertModule,
    SocialLoginModule,
    CommonModule,
    SectionsModule,
    NgxDropzoneModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          // {
          //   id: GoogleLoginProvider.PROVIDER_ID,
          //   provider: new GoogleLoginProvider(
          //     '353461452701978'
          //   ),
          // },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('353461452701978'),
          },
          // {
          //   id: AmazonLoginProvider.PROVIDER_ID,
          //   provider: new AmazonLoginProvider(
          //     '353461452701978'
          //   ),
          // },
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
