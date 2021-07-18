import { AlertService } from "./../_alert/alert.service";
import { IRelationship, RelationshipType } from "./../../models/models";
import { RelationshipService } from "./../service/relationship.service";
import { AuthenticationService } from "../service/authentication.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Location, PopStateEvent } from "@angular/common";
import { NotificationUserService } from "src/app/shared/service/notification-user.service";
import {
  faSpinner,
  faCaretDown,
  faSignOutAlt,
  faChartPie,
  faLock,
  faComments,
  faAddressCard,
} from "@fortawesome/free-solid-svg-icons";
import { INotification, IUserInfo } from "src/app/models/models";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  @ViewChild("openConfirmModal") modal: ElementRef<HTMLElement>;
  @ViewChild("toggleNotification") toggleNotification: ElementRef<HTMLElement>;

  public isCollapsed = true;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  token: string;

  faSpinner = faSpinner;
  faCaretDown = faCaretDown;
  faChartPie = faChartPie;
  faLock = faLock;
  faComments = faComments;
  faAddressCard = faAddressCard;
  faSignOutAlt = faSignOutAlt;

  RelationshipType = RelationshipType;

  userInfo: IUserInfo;
  constructor(
    public location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    public notificationUserService: NotificationUserService,
    private relationshipService: RelationshipService,
    private alertService: AlertService
  ) {
    this.authenticationService.userInfoObservable.subscribe(
      (user) => (this.userInfo = user)
    );
  }
  onMessageClick() {
    this.router.navigateByUrl("chat");
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
        } else window.scrollTo(0, 0);
      }
    });
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
  }

  isHome() {
    var title = this.location.prepareExternalUrl(this.location.path());

    if (title === "#/home") {
      return true;
    } else {
      return false;
    }
  }
  isDocumentation() {
    var title = this.location.prepareExternalUrl(this.location.path());
    if (title === "#/documentation") {
      return true;
    } else {
      return false;
    }
  }

  logout = () => {
    this.userInfo = undefined;
    this.authenticationService.removeUserInfo();
    this.router.navigateByUrl("/home");
  };

  clickMyProfile = () => {
    var url = this.router.url.split("/")[1];
    this.router.navigate(["/profile", this.userInfo.id]);
    if (url === "profile") {
      setTimeout(() => {
        window.location.reload();
      }, 5);
    }
  };

  loadingNotification = false;

  isNoMore = false;
  options = {
    autoClose: true,
    keepAfterRouteChange: false,
  };
  onMoreNotifications() {
    this.loadingNotification = true;
    this.notificationUserService.pageIndex += 1;
    this.notificationUserService
      .GetNotification(
        this.userInfo.id,
        this.notificationUserService.pageIndex,
        this.notificationUserService.pageSize
      )
      .then((data) => {
        if (data.length == 0) {
          this.alertService.warn("Không còn thông báo nào", this.options);
          this.isNoMore = true;
          return;
        }

        this.loadingNotification = false;
        this.notificationUserService.Notification =
          this.notificationUserService.Notification.concat(data);
        this.notificationUserService.Notification.forEach((element) => {
          element.fullName = this.getLastName(element.fullName);
        });
      })
      .catch((err) => {
        this.loadingNotification = false;
      });
  }

  onViewNotification() {
    if (this.notificationUserService.Notification.length > 0) {
      return;
    }
    this.loadingNotification = true;
    this.notificationUserService
      .GetNotification(this.userInfo.id, 1, 3)
      .then((data) => {
        this.loadingNotification = false;
        this.notificationUserService.Notification = data;

        console.log(this.notificationUserService.Notification);
      })
      .catch((error) => {
        this.loadingNotification = false;
        console.log(error);
      });
  }

  getLastName(fullName: string) {
    var n = fullName.split(" ");
    return n[n.length - 1];
  }

  currentNotification: INotification = {} as INotification;
  onClick(item: INotification) {
    this.toggleNotification.nativeElement.click();
    this.currentNotification = item;

    if (
      item.type === "follow" ||
      item.type === "like" ||
      item.type == "likeImage"
    ) {
      this.router.navigate(["/profile/" + item.fromId]);
      return;
    }

    if (item.type === "relationship") {
      console.log(item);
      this.getRelationship(item.fromId, item.toId);
      this.modal.nativeElement.click();
    }
  }

  relationshipNotification: IRelationship = {} as IRelationship;

  getRelationship(fromId: string, toId: string) {
    this.relationshipService.GetByIds(fromId, toId).subscribe(
      (data) => {
        this.relationshipNotification = data;
      },
      (err) => {
        this.alertService.error("Không lấy được relationship");
      }
    );
  }

  onAccept() {
    this.relationshipService.Accept(this.relationshipNotification.id).subscribe(
      (data) => {
        this.router.navigate([
          "/profile/" + this.relationshipNotification.fromId,
        ]);
        this.alertService.success(
          "Chúc mừng, bạn đã có mối quan hệ mới, hãy cố gắng nhé!"
        );

        this.notificationUserService.Notification =
          this.notificationUserService.Notification.filter(
            (x) => x.type != "relationship"
          );
      },
      (err) => {
        this.alertService.error("Không thể chấp nhận lúc này");
      }
    );
  }

  onDecline() {
    this.relationshipService
      .Decline(this.relationshipNotification.id)
      .subscribe(
        (data) => {
          this.alertService.warn(
            "Bạn đã từ chối mối quan hệ với " +
              this.getLastName(this.relationshipNotification.fromName)
          );
          this.removeNotificationFromList(this.currentNotification.id);
        },
        (err) => {
          this.alertService.error("Không thể từ chối lúc này");
        }
      );
  }

  removeNotificationFromList(notificationId: number) {
    this.notificationUserService.Notification =
      this.notificationUserService.Notification.filter(
        (x) => x.id != notificationId
      );
  }
}
