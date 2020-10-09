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
    constructor(public location: Location, private router: Router) {
    }

    ngOnInit() {
        //localStorage.removeItem('UserInfo')
        var user = JSON.parse(localStorage.getItem('UserInfo'))
        console.log(user.token)
        this.token = user.token
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

    clickAvatar = () => {
        var dropdownId = <HTMLElement> document.getElementById('dropdownAvatar')
        var avatarId = <HTMLElement> document.getElementById('avatarUser')
        var menuAvatarId = <HTMLElement> document.getElementById('menuAvatar')

        dropdownId.setAttribute('class' , 'show')
        //avatarId.setAttribute('aria-expanded', 'true')
        menuAvatarId.setAttribute('class' , 'show')
    }
    ngAfterViewInit(): void {
        
    }
}
