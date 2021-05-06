import { AuthenticationService } from '../../service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';
import { NotificationUserService } from 'src/app/service/notification-user.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IUserInfo } from 'src/app/models/models';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public isCollapsed = true;
    private lastPoppedUrl: string;
    private yScrollStack: number[] = [];
    token: string

    faSpinner = faSpinner;

    userInfo:IUserInfo;
    constructor(
        public location: Location,
        private router: Router,
        private authenticationService: AuthenticationService,
        public notificationUserService: NotificationUserService,
    ) {
        this.authenticationService.userInfoObservable
	        .subscribe(user => this.userInfo = user)
    }
    onMessageClick(){
        this.router.navigateByUrl('friendlist');
    }
    ngOnInit() {
        //localStorage.removeItem('UserInfo')

        this.router.events.subscribe((event) => {
            this.isCollapsed = true;
            if (event instanceof NavigationStart) {
                if (event.url != this.lastPoppedUrl)
                    this.yScrollStack.push(window.scrollY);
            } else if (event instanceof NavigationEnd) {
                if (event.url == this.lastPoppedUrl) {
                    this.lastPoppedUrl = undefined;
                    window.scrollTo(0, this.yScrollStack.pop());
                } else
                    window.scrollTo(0, 0);
            }
        });
        this.location.subscribe((ev: PopStateEvent) => {
            this.lastPoppedUrl = ev.url;
        });
    }

    isHome() {
        var title = this.location.prepareExternalUrl(this.location.path());

        if (title === '#/home') {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var title = this.location.prepareExternalUrl(this.location.path());
        if (title === '#/documentation') {
            return true;
        }
        else {
            return false;
        }
    }

    logout = () => {
        this.userInfo = undefined;
        this.authenticationService.removeUserInfo();
        this.router.navigateByUrl('/home');
    }

    clickMyProfile = () => {
        this.router.navigate(['/profile' , this.userInfo.id]);
    }
    loadingNotification = false;

    onMoreNotifications(){
        this.loadingNotification = true;
        this.notificationUserService.pageIndex += 1;
        this.notificationUserService.GetNotification(this.userInfo.id, this.notificationUserService.pageIndex, this.notificationUserService.pageSize)
            .then(data =>{
                this.loadingNotification = false;
                this.notificationUserService.Notification = this.notificationUserService.Notification.concat(data);
                this.notificationUserService.Notification.forEach(element => {
                    element.fullName = this.getLastName(element.fullName);
                });
            })
            .catch(err =>{
                this.loadingNotification = false;
            })
    }

    onViewNotification(){
        if(this.notificationUserService.Notification.length > 0){
            return;
        }
        this.loadingNotification = true;
        this.notificationUserService.GetNotification(this.userInfo.id, 1, 3)
        .then(data=>{
            this.loadingNotification = false;
          this.notificationUserService.Notification = data;
          this.notificationUserService.Notification.forEach(element => {
              element.fullName = this.getLastName(element.fullName);
          });
          
          console.log(this.notificationUserService.Notification);
        })
        .catch(error => {
            this.loadingNotification = false;
            console.log(error)})
    }

     getLastName(fullName:string) {
        var n = fullName.split(" ");
        return n[n.length - 1];
    }
}