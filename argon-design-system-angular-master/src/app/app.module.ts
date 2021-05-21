import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './user-components/signup/signup.component';
import { ProfileComponent } from './user-components/profile/profile.component';
import { HomeComponent } from './user-components/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
//import { HomeModule } from './home/home.module';
import { LoginComponent } from './shared/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AlertModule } from './shared/_alert';
import { ConfirmEmailComponent } from './user-components/confirm-email/confirm-email.component';
import { FacebookLoginComponent } from './user-components/facebook-login/facebook-login.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { ChatComponent } from './user-components/chat/chat.component';
import { NgxStarRatingModule } from 'ngx-star-rating';

import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';
import { FriendListComponent } from './user-components/friend-list/friend-list.component';
import { ChangePasswordComponent } from './user-components/change-password/change-password.component';
import { CommonModule } from '@angular/common';
import { SeenImageComponent } from './user-components/seen-image/seen-image.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FilterFriendsComponent } from './user-components/filter-friends/filter-friends.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatisticComponent } from './admin-components/statistic/statistic.component';
import { ManagerUserComponent } from './admin-components/manager-user/manager-user.component';
import { NavbarAdminComponent } from './shared/navbar-admin/navbar-admin.component';
import { ChartsModule } from 'ng2-charts';
import { TagInputModule } from 'ngx-chips';
import { FeatureManagerComponent } from './admin-components/feature-manager/feature-manager.component';
import { ImageScoreComponent } from './admin-components/image-score/image-score.component';
import { CarouselComponent } from './user-components/carousel/carousel.component';
import { VideoCallComponent } from './user-components/video-call/video-call.component';
import { VideoMemberComponent } from './user-components/video-member/video-member.component';
//import { RtcSignalRService } from './service/rtc-signal-r.service';
import { SignalRService } from './shared/service/signal-r.service';
import { IntroduceComponent } from './user-components/introduce/introduce.component';
import { SharedStoryComponent } from './user-components/shared-story/shared-story.component';
import { StringEnumPipe } from './shared/pipe/string-enum-pipe';
import { TestComponent } from './user-components/test/test.component';
import { ScanAroundComponent } from './user-components/scan-around/scan-around.component';
@NgModule({
  declarations: [
    StringEnumPipe,
    AppComponent,
    SignupComponent,
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
    FilterFriendsComponent,
    StatisticComponent,
    ManagerUserComponent,
    NavbarAdminComponent,
    FeatureManagerComponent,
    ImageScoreComponent,
    CarouselComponent,
    VideoCallComponent,
    VideoMemberComponent,
    IntroduceComponent,
    SharedStoryComponent,
    TestComponent,
    ScanAroundComponent,
  ],
  imports: [
    NgxStarRatingModule,
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
    NgxDropzoneModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    ChartsModule,
    TagInputModule,
    ReactiveFormsModule
  ],
  providers: [
    // RtcSignalRService,
    SignalRService,
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
  exports:[
    StringEnumPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
