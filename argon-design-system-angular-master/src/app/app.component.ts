import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, HostListener, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { AuthenticationService } from './signup/authentication.service';
import { SignalRService } from './service/signal-r.service';
import { MessageService } from './service/message.service';
import { Message, UserDisplay } from './Models/Models';
import { UsersService } from './service/users.service';

var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = 0;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _router: Subscription;

    constructor(private renderer: Renderer2,
        private router: Router, @Inject(DOCUMENT,) private document: any,
        private element: ElementRef,
        public location: Location,
        private authenticationService: AuthenticationService,
        public signalRService: SignalRService,
        private messageService: MessageService,
        private usersService: UsersService,
        private _ngZone: NgZone,
        ) {
            this.subscribeToEvents();
         }
    @HostListener('window:scroll', ['$event'])
    hasScrolled() {

        var st = window.pageYOffset;
        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        var navbar = document.getElementsByTagName('nav')[0];

        // If they scrolled down and are past the navbar, add class .headroom--unpinned.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            if (navbar.classList.contains('headroom--pinned')) {
                navbar.classList.remove('headroom--pinned');
                navbar.classList.add('headroom--unpinned');
            }
            // $('.navbar.headroom--pinned').removeClass('headroom--pinned').addClass('headroom--unpinned');
        } else {
            // Scroll Up
            //  $(window).height()
            if (st + window.innerHeight < document.body.scrollHeight) {
                // $('.navbar.headroom--unpinned').removeClass('headroom--unpinned').addClass('headroom--pinned');
                if (navbar.classList.contains('headroom--unpinned')) {
                    navbar.classList.remove('headroom--unpinned');
                    navbar.classList.add('headroom--pinned');
                }
            }
        }

        lastScrollTop = st;
    };
    ngOnInit() {
        var userInfo = {
            Id: '',
            UserName: '',
            FullName: '',
            Email: '',
            token: '',
            IsInfoUpdated: false,
            hasAvatar: false,
            avatarPath: ''
          };
          this.authenticationService.UserInfo = userInfo;;

        this.authenticationService.UserInfo = JSON.parse(localStorage.getItem('UserInfo'))
        if (this.authenticationService.UserInfo != null) {
            if (this.authenticationService.UserInfo.token != null) {
                this.authenticationService.ValidateToken()
                    .then(() => {
                        this.authenticationService.IsLogin = true;
                        console.log('Valid token')
                        //this.signalRService.startConnection();
                        this.signalRService.startConnection();
                        this.signalRService.addTransferChartDataListener();
                    })
                    .catch(error => {
                        if (error.status == 401) {
                            console.log('Token Invalid');
                            localStorage.clear();
                            this.authenticationService.IsLogin = false;
                            this.authenticationService.UserInfo = null;
                        }
                    })

            }
            else {
                this.authenticationService.IsLogin = false;
                this.authenticationService.UserInfo = null;
            }
        }




        var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }
            this.renderer.listen('window', 'scroll', (event) => {
                const number = window.scrollY;
                if (number > 150 || window.pageYOffset > 150) {
                    // add logic
                    navbar.classList.add('headroom--not-top');
                } else {
                    // remove logic
                    navbar.classList.remove('headroom--not-top');
                }
            });
        });
        this.hasScrolled();
    }

    subscribeToEvents = () => {
        this.signalRService.messageReceived.subscribe((response: any) => {
          this._ngZone.run(() => {
            console.log('this is res');
            console.log(response);
            var message = new Message();
            message = response;
            if (message.senderId == this.authenticationService.UserInfo.Id) {
              message.type = 'sent';
              console.log('sender');
              var userIndex = this.getUserIndex(message.receiverId);
              if (userIndex == -1) {
                var newUser = new UserDisplay();
                this.usersService.GetDisplayUser(message.receiverId)
                  .then(response => {
                    newUser = response;
                  })
                  .catch(error => {
                    alert("Can not get display user");
                    return;
                  })
              }
              var userIndex = this.getUserIndex(message.receiverId);
              this.messageService.friendList[userIndex].messages.push(message);
            } else if (message.receiverId == this.authenticationService.UserInfo.Id) {
              message.type = 'received';
              console.log('receiver');
              var userIndex = this.getUserIndex(message.senderId);
              this.messageService.friendList[userIndex].messages.push(message);
            } else {
              console.log("nothing!");
            }
          })
        })
      }
      getUserIndex = (userId: string) => {
        var index = -1;
        for (let i = 0; i < this.messageService.friendList.length; i++) {
          if (this.messageService.friendList[i].user.id == userId) {
            return i;
          }
        }
      }
}
