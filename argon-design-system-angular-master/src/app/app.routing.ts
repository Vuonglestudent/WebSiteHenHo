import { ScanAroundComponent } from './user-components/scan-around/scan-around.component';
import { SharedStoryComponent } from './user-components/shared-story/shared-story.component';
import { ManagerUserComponent } from './admin-components/manager-user/manager-user.component';
import { StatisticComponent } from './admin-components/statistic/statistic.component';
import { FilterFriendsComponent } from './user-components/filter-friends/filter-friends.component';
import { SeenImageComponent } from './user-components/seen-image/seen-image.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './user-components/home/home.component';
import { ProfileComponent } from './user-components/profile/profile.component';
import { SignupComponent } from './user-components/signup/signup.component';
import { LoginComponent } from './shared/login/login.component';
import { FacebookLoginComponent } from './user-components/facebook-login/facebook-login.component';
import { FriendListComponent } from './user-components/friend-list/friend-list.component'
import { ChangePasswordComponent } from './user-components/change-password/change-password.component';
import {FeatureManagerComponent} from './admin-components/feature-manager/feature-manager.component';
import { ImageScoreComponent } from './admin-components/image-score/image-score.component';
import { VideoCallComponent } from './user-components/video-call/video-call.component';
import { TestComponent } from './user-components/test/test.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'facebooklogin', component: FacebookLoginComponent },
  { path: 'friendlist', component: FriendListComponent },
  { path: 'changepassword', component: ChangePasswordComponent },
  { path: 'test', component: TestComponent },
  { path: 'filterfriends' , component: FilterFriendsComponent},
  { path: 'statistic' , component: StatisticComponent},
  { path: 'manager-user' , component: ManagerUserComponent},
  {path: 'feature-manager', component: FeatureManagerComponent},
  {path: 'image-score', component: ImageScoreComponent},
  {path: 'video-call/:isAccept/:id', component: VideoCallComponent},
  {path: 'shared-stories', component: SharedStoryComponent},
  {path: 'scan-around', component: ScanAroundComponent}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
