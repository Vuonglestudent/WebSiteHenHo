import { AuthenticationService } from './../../signup/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';


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
    imgAvatar = './assets/img/theme/team-3-800x800.jpg'
    messageAwait = 4

    constructor(
        public location: Location,
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        //localStorage.removeItem('UserInfo')
        var user = JSON.parse(localStorage.getItem('UserInfo'))
        if (user != null) {
            this.token = user.token
            if (this.token != null) {
                this.authenticationService.IsLogin = true;
                this.authenticationService.UserInfo = user;
            }
            else {
                this.authenticationService.IsLogin = false;
                this.authenticationService.UserInfo = null;
            }
        }
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
        var titlee = this.location.prepareExternalUrl(this.location.path());

        if (titlee === '#/home') {
            return true;
        }
        else {
            return false;
        }
    }
    isDocumentation() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee === '#/documentation') {
            return true;
        }
        else {
            return false;
        }
    }

    logout = () => {
        this.authenticationService.Logout();

        localStorage.removeItem('UserInfo');
        this.token = null;
        this.authenticationService.IsLogin = false;
        this.router.navigateByUrl('/home');
    }


    ngAfterViewInit(): void {

    }
}
