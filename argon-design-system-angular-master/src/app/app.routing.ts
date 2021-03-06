import { ManagerUserComponent } from './manager-user/manager-user.component';
import { StatisticComponent } from './statistic/statistic.component';
import { FilterFriendsComponent } from './filter-friends/filter-friends.component';
import { SeenImageComponent } from './seen-image/seen-image.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { FacebookLoginComponent } from './facebook-login/facebook-login.component';
import { FriendListComponent } from './friend-list/friend-list.component'
import { ChangePasswordComponent } from './change-password/change-password.component'
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'register', component: SignupComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'facebooklogin', component: FacebookLoginComponent },
  { path: 'friendlist', component: FriendListComponent },
  { path: 'changepassword', component: ChangePasswordComponent },
  //{ path: 'test', component: SeenImageComponent },
  { path: 'filterfriends' , component: FilterFriendsComponent},
  { path: 'statistic' , component: StatisticComponent},
  { path: 'manager-user' , component: ManagerUserComponent}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
