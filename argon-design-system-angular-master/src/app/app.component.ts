import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, HostListener, NgZone, TemplateRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { AuthenticationService } from './user-components/signup/authentication.service';
import { SignalRService } from './service/signal-r.service';
import { MessageService } from './service/message.service';
import { ChatFriend, Message, User, UserDisplay } from './models/models';
import { UsersService } from './service/users.service';
import { NotificationsService } from 'angular2-notifications';
import { NotificationUserService } from './service/notification-user.service';
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
    private notificationService: NotificationsService,
    private notificationUserService: NotificationUserService,
  ) {
    this.subscribeToEvents();
  }
  // @HostListener('window:scroll', ['$event'])
  // hasScrolled() {

  //   var st = window.pageYOffset;
  //   // Make sure they scroll more than delta
  //   if (Math.abs(lastScrollTop - st) <= delta)
  //     return;

  //   var navbar = document.getElementsByTagName('nav')[0];

  //   // If they scrolled down and are past the navbar, add class .headroom--unpinned.
  //   // This is necessary so you never see what is "behind" the navbar.
  //   if (st > lastScrollTop && st > navbarHeight) {
  //     // Scroll Down
  //     if (navbar.classList.contains('headroom--pinned')) {
  //       navbar.classList.remove('headroom--pinned');
  //       navbar.classList.add('headroom--unpinned');
  //     }
  //     // $('.navbar.headroom--pinned').removeClass('headroom--pinned').addClass('headroom--unpinned');
  //   } else {
  //     // Scroll Up
  //     //  $(window).height()
  //     if (st + window.innerHeight < document.body.scrollHeight) {
  //       // $('.navbar.headroom--unpinned').removeClass('headroom--unpinned').addClass('headroom--pinned');
  //       if (navbar.classList.contains('headroom--unpinned')) {
  //         navbar.classList.remove('headroom--unpinned');
  //         navbar.classList.add('headroom--pinned');
  //       }
  //     }
  //   }

  //   lastScrollTop = st;
  // };
  ngOnInit() {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
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
    this.authenticationService.UserInfo = userInfo;

    this.authenticationService.UserInfo = JSON.parse(localStorage.getItem('UserInfo'));

    if (this.authenticationService.UserInfo != null) {

      this.authenticationService.ValidateToken()
        .then(() => {
          this.authenticationService.IsLogin = true;
          console.log('Valid token')

          //console.log(this.signalRService.connectionId);
          //this.signalRService.SaveHubId();
        })
        .catch(error => {
          console.log('Token Invalid');
          localStorage.clear();
          this.authenticationService.IsLogin = false;
          this.authenticationService.UserInfo = null;
        })
    }
    else {
      localStorage.clear();
      this.authenticationService.IsLogin = false;
      this.authenticationService.UserInfo = null;
    }


    //var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
    // var navbar = <HTMLElement> document.getElementById('navbar-main')
    // console.log(navbar)
    // this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
    //   if (window.outerWidth > 991) {
    //     window.document.children[0].scrollTop = 0;
    //   } else {
    //     window.document.activeElement.scrollTop = 0;
    //   }
    //   this.renderer.listen('window', 'scroll', (event) => {
    //     const number = window.scrollY;
    //     if (number > 150 || window.pageYOffset > 150) {
    //       // add logic
    //       navbar.classList.add('headroom--not-top');
    //     } else {
    //       // remove logic
    //       navbar.classList.remove('headroom--not-top');
    //     }
    //   });
    // });
    // this.hasScrolled();
  }

  senderId = ''
  subscribeToEvents = () => {
    this.signalRService.messageReceived.subscribe((response: any) => {
      this._ngZone.run(() => {
        var message = new Message();
        message = response;

        if (message.type == "onlineCount") {
          console.log('Number of online users: ' + message.onlineCount)
          this.messageService.onlineCount = message.onlineCount;
        }
        else if (message.type == "notification") {
          if (checkUrl !== "chat" && checkUrl !== "friendlist") {
            this.notificationUserService.Notification.splice( 0, 0, message );
            this.showNotification(response);
          }
        }
        else {
          //Là người gửi
          if (message.senderId == this.authenticationService.UserInfo.Id) {
            message.type = 'sent';
            console.log('sender');

            var userIndex = this.getUserIndex(message.receiverId);
            //Chưa có trong danh sách bạn.
            if (userIndex == -1) {
              // var newUser = new UserDisplay();
              // this.usersService.GetDisplayUser(message.receiverId)
              //   .then(response => {
              //     newUser = response;
              //     var friend = new ChatFriend();
              //     friend.user = new UserDisplay();
              //     friend.messages = new Array<Message>();
              //     friend.messages.push(message);

              //   })
              //   .catch(error => {
              //     alert("Can not get display user");
              //   })
            }
            else {
              try {
                this.messageService.friendList[userIndex].messages.push(message);
              }
              catch { }
            }

            //Là người nhận
          } else if (message.receiverId == this.authenticationService.UserInfo.Id) {
            message.type = 'received';
            console.log('receiver');
            var checkUrl = this.router.url.split("/")[1]
            console.log(checkUrl)
            this.senderId = response.senderId

            //Hiện thông báo
            if (checkUrl !== "chat" && checkUrl !== "friendlist") {
              this.showNotification(response);
            }


            var userIndex = this.getUserIndex(message.senderId);

            if (userIndex == -1) {
              // var newUser = new UserDisplay();
              // this.usersService.GetDisplayUser(message.receiverId)
              //   .then(response => {
              //     newUser = response;
              //     var friend = new ChatFriend();
              //     friend.user = new UserDisplay();
              //     friend.messages = new Array<Message>();
              //     friend.messages.push(message);

              //   })
              //   .catch(error => {
              //     alert("Can not get display user");
              //   })
            }
            else {
              try {
                this.messageService.friendList[userIndex].messages.push(message);
              }
              catch { }
            }
          }
        }

      })
    })
  }

  clickNotificationMes = (sendId) => {
    console.log("click", sendId)
    this.router.navigateByUrl('/friendlist');
  }

  getUserIndex = (userId: string) => {
    var index = -1;
    for (let i = 0; i < this.messageService.friendList.length; i++) {
      if (this.messageService.friendList[i].user.id == userId) {
        return i;
      }
    }
  }

  showNotification(message) {


    this.notificationService.html(`
    <div class="d-flex align-items-center" style="padding-bottom: 0%;">
      <img class="rounded-circle user_img_msg"
        src="data:image/gif;base64,${message.avatar}" alt="">
        <div class="col-12">
          <h5 style="margin-bottom: 0%;">${message.fullName}</h5>
          <p>${message.content}</p>
        </div>
    </div>`, null, {
      position: ['bottom', 'right'],
      timeOut: 2000,
      clickToClose: false,
      theClass: 'notification_mes',
      animate: 'fade',
      showProgressBar: true,
    });
  }
}
