import {
  FeatureVM,
  IRelationship,
  IUserInfo,
  RelationshipType,
} from "../../models/models";
import { MessageService } from "../../shared/service/message.service";
import { AlertService } from "../../shared/_alert/alert.service";
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { UsersService } from "../../shared/service/users.service";
import { User, ProfileData, Image } from "../../models/models";
import { AuthenticationService } from "../../shared/service/authentication.service";
import { ImageService } from "../../shared/service/image.service";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute, Router } from "@angular/router";
import { slideInOutAnimation } from "../../shared/_animates/animates";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  animations: [slideInOutAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  host: { "[@slideInOutAnimation]": "" },
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit, AfterViewInit {
  RelationshipType = RelationshipType;
  editing: boolean = false;
  imageTitle: string = "";
  checkUser = false;
  imagesResponse: Image[] = new Array();
  isViewFriendList: boolean = false;
  FriendList: User[] = new Array();
  BlockList: User[] = new Array();
  //icon
  faSpinner = faSpinner;
  currentUserId;
  //profile user
  isViewInfomationBasics = false;
  isViewInfomations = false;
  isViewCharaters = false;
  isViewLikes = false;
  isViewActions = false;

  pageIndex = 1;
  pageSize = 8;

  profileData: ProfileData = new ProfileData();
  public UserProfile: User = new User();
  isViewImageList = false;

  userInfo: IUserInfo;

  relationship: IRelationship = { id: 0 } as IRelationship;
  constructor(
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private imageService: ImageService
  ) {
    this.authenticationService.userInfoObservable.subscribe((user) => {
      this.userInfo = user;
    });

    this.currentUserId = this.route.snapshot.paramMap.get("id");
    if (this.route.snapshot.paramMap.get("id") === this.userInfo.id) {
      this.checkUser = true;
    } else {
      this.checkUser = false;
    }
  }

  ngAfterViewInit(): void {
    if (!this.userInfo.isInfoUpdated) {
      this.editing = true;
      this.alertService.clear();
      this.alertService.warn(
        "Vui lòng cập nhật hồ sơ để tiếp tục sử dụng ứng dụng!"
      );
      return;
    }
  }

  options = {
    autoClose: false,
    keepAfterRouteChange: false,
  };

  Features: FeatureVM[] = new Array();
  SearchFeatures: FeatureVM[] = new Array();
  UpdateFeatures = new Array();
  isYourself = false;
  ngOnInit() {
    this.loadUser();

    this.onViewImage();

    if (this.userInfo.id == this.currentUserId) {
      this.onViewFriendList();
      this.isYourself = true;
    }
  }

  loadUser() {
    this.usersService
      .GetById(this.currentUserId)
      .then((data) => {
        if (data.relationship) {
          this.relationship = data.relationship;
        }
        console.log(this.relationship);
        this.UserProfile = data;
        this.replaceCharacter();
        this.Features = this.UserProfile.features;
        this.SearchFeatures = this.UserProfile.searchFeatures;

        this.UserProfile.dob = this.UserProfile.dob.split("T")[0];

        /////
        this.usersService
          .GetProfileData()
          .then((data) => {
            this.profileData = data;

            for (let i = 0; i < this.profileData.features.length; i++) {
              var isExist = false;
              for (let j = 0; j < this.Features.length; j++) {
                if (
                  this.profileData.features[i].id === this.Features[j].featureId
                ) {
                  isExist = true;
                  this.Features[j].featureDetails =
                    this.profileData.features[i].featureDetails;
                  break;
                }
              }
              if (!isExist) {
                if (this.CheckNonFeature(this.profileData.features[i].id)) {
                  continue;
                }
                var feature = new FeatureVM();
                feature.featureId = this.profileData.features[i].id;
                feature.featureDetailId = -1;
                feature.name = this.profileData.features[i].name;
                feature.content = "CHƯA CẬP NHẬT!";
                feature.isSearchFeature =
                  this.profileData.features[i].isSearchFeature;
                feature.featureDetails =
                  this.profileData.features[i].featureDetails;
                this.Features.push(feature);
              }
            }

            for (let i = 0; i < this.profileData.features.length; i++) {
              if (!this.profileData.features[i].isSearchFeature) {
                continue;
              }
              var isExist = false;
              for (let j = 0; j < this.SearchFeatures.length; j++) {
                if (
                  this.profileData.features[i].id ===
                  this.SearchFeatures[j].featureId
                ) {
                  isExist = true;
                  this.SearchFeatures[j].featureDetails =
                    this.profileData.features[i].featureDetails;
                  break;
                }
              }
              if (!isExist) {
                if (
                  this.CheckNonSearchFeature(this.profileData.features[i].id)
                ) {
                  continue;
                }
                var feature = new FeatureVM();
                feature.featureId = this.profileData.features[i].id;
                feature.featureDetailId = -1;
                feature.name = this.profileData.features[i].name;
                feature.content = "CHƯA CẬP NHẬT!";
                feature.isSearchFeature =
                  this.profileData.features[i].isSearchFeature;
                feature.featureDetails =
                  this.profileData.features[i].featureDetails;
                this.SearchFeatures.push(feature);
              }
            }

            this.profileData.job.unshift(this.UserProfile.job);
            this.profileData.location.unshift(this.UserProfile.location);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  CheckNonFeature(featureId: number) {
    for (let i = 0; i < this.Features.length; i++) {
      if (this.Features[i].featureId === featureId) {
        return true;
      }
    }
    return false;
  }

  CheckNonSearchFeature(featureId: number) {
    for (let i = 0; i < this.SearchFeatures.length; i++) {
      if (this.SearchFeatures[i].featureId === featureId) {
        return true;
      }
    }
    return false;
  }

  isSeenMoreImage = false;
  clickSeenMoreImage = () => {
    this.isSeenMoreImage = !this.isSeenMoreImage;
  };

  viewImageList = () => {
    this.isViewImageList = !this.isViewImageList;
    this.isSeenMoreImage = false;
    this.isViewFriendList = false;
    this.editing = false;
    this.uploadImage = false;
  };
  updating: boolean = false;
  onUpdateInfo() {
    this.updating = true;
    var updateProfile = this.UserProfile;
    this.reReplaceCharacter(updateProfile);
    console.log(updateProfile);
    this.usersService
      .UpdateProfile(updateProfile, this.Features, this.SearchFeatures)
      .then((data) => {
        this.updating = false;
        this.UserProfile = data;

        this.loadUser();

        this.alertService.clear();
        this.alertService.success("Cập nhật hồ sơ thành công!");
        this.editing = false;
        this.userInfo.isInfoUpdated = true;
        this.authenticationService.setUserInfo(this.userInfo);
        this.usersService.Favoritors = new Array();
      })
      .catch((error) => {
        this.updating = false;
        this.alertService.clear();
        this.alertService.error(error.error.message, this.options);
      });
  }

  onOptionsSearchFeatureSelected(event, index: number) {
    const value = event.target.value;
    console.log(value);
    for (let i = 0; i < this.profileData.features.length; i++) {
      if (
        this.profileData.features[i].id ===
        this.SearchFeatures[index]?.featureId
      ) {
        for (
          let j = 0;
          j < this.profileData.features[i].featureDetails.length;
          j++
        ) {
          if (this.profileData.features[i].featureDetails[j].id == value) {
            this.SearchFeatures[index].content =
              this.profileData.features[i].featureDetails[j].content;

            this.SearchFeatures[index].featureDetailId =
              this.profileData.features[i].featureDetails[j].id;
          }
        }
      }
    }
  }

  onOptionsFeatureSelected(event, index: number) {
    const value = event.target.value;
    console.log(value);
    for (let i = 0; i < this.profileData.features.length; i++) {
      if (this.profileData.features[i].id === this.Features[index].featureId) {
        for (
          let j = 0;
          j < this.profileData.features[i].featureDetails.length;
          j++
        ) {
          if (this.profileData.features[i].featureDetails[j].id == value) {
            this.Features[index].content =
              this.profileData.features[i].featureDetails[j].content;

            this.Features[index].featureDetailId =
              this.profileData.features[i].featureDetails[j].id;
          }
        }
      }
    }
  }

  clickFavourite = () => {
    this.UserProfile.favorited = !this.UserProfile.favorited;
    this.UserProfile.favorited == false
      ? this.UserProfile.numberOfFavoritors--
      : this.UserProfile.numberOfFavoritors++;
    this.usersService
      .Favorite(this.currentUserId)
      .then((data) => console.log(data))
      .catch((error) => console.log("can not favorite"));
  };

  clickFollow = (e) => {
    this.UserProfile.followed = !this.UserProfile.followed;
    this.usersService
      .Follow(this.currentUserId)
      .then((data) => console.log(data))
      .catch((error) => console.log("Can not follow"));
  };

  viewProfile = false;
  onViewProfile() {
    this.viewProfile = !this.viewProfile;
    console.log(this.viewProfile);
  }
  clickEdit = () => {
    if (!this.viewProfile) {
      document.getElementById("viewProfileBtn").click();
    }
    this.editing = !this.editing;
    this.uploadImage = false;
    this.isViewFriendList = false;
    this.isViewImageList = false;
  };

  arrayNumbers(n: number, startFrom: number): number[] {
    return [...Array(n).keys()].map((i) => i + startFrom);
  }

  files: File[] = [];
  uploadImage: boolean = false;

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadImages() {
    this.uploadImage = !this.uploadImage;
    this.editing = false;
    this.isViewImageList = false;
    this.isViewFriendList = false;
  }
  uploadStatus: string = "none";
  onUpload() {
    this.uploadStatus = "loading";
    this.imageService
      .addImages(this.userInfo.id, this.files, this.imageTitle)
      .then((response) => {
        this.uploadStatus = "none";
        this.alertService.clear();
        if (response.approved) {
          this.alertService.success(response.message, this.options);
        } else {
          this.alertService.warn(response.message, this.options);
        }
        this.files = [];
        this.ngOnInit();
        this.uploadImage = !this.uploadImage;
      })
      .catch((error) => {
        this.uploadStatus = "none";
        this.alertService.clear();
        this.alertService.error("Có lỗi khi upload ảnh!", this.options);
      });
  }

  pageIndexImage = 1;
  pageSizeImage = 8;

  isLoadingImage = false;
  isNoMoreImage = false;

  onViewImage = () => {
    this.isLoadingImage = true;
    this.imageService
      .getImageByUserId(
        this.route.snapshot.paramMap.get("id"),
        this.pageIndexImage,
        this.pageSizeImage
      )
      .then((data) => {
        if (data.length == 0) {
          this.isNoMoreImage = true;
          return;
        }
        this.pageIndexImage += 1;
        this.isLoadingImage = false;
        this.imagesResponse = this.imagesResponse.concat(data);
      })
      .catch((error) => {
        this.isLoadingImage = false;
        this.alertService.clear();
        this.alertService.error("Có lỗi khi tải hình ảnh!");
      });
  };

  replaceCharacter = () => {
    this.UserProfile.job = this.UserProfile.job.replace(/_/g, " ");
    this.UserProfile.location = this.UserProfile.location.replace(/_/g, " ");
    // this.UserProfile.findAgeGroup = this.UserProfile.findAgeGroup.replace(/_/g, " ");
  };

  reReplaceCharacter = (userProfile: User) => {
    userProfile.location = userProfile.location.replace(/ /g, "_");
    userProfile.job = userProfile.job.replace(/ /g, "_");
    // userProfile.findAgeGroup = userProfile.findAgeGroup.replace(/ /g, "_");
  };

  numbers = Array(200).fill(0);
  popMessage = false;
  popTextAreaMessage = () => {
    this.popMessage = true;
  };

  txtMessage = "";
  sendMessage = (id) => {
    //this.router.navigate(['/chat', id])
    console.log(id, this.txtMessage);
    if (this.txtMessage != "") {
      this.messageService
        .SendMessage(this.userInfo.id, id, this.txtMessage, null)
        .then((data) => {
          this.alertService.clear();
          this.alertService.success(
            "Tin nhắn của bạn đã được gửi đến " + this.UserProfile.fullName,
            this.options
          );
        })
        .catch((error) => {
          console.log(error);
        });
      this.txtMessage = "";
      this.popMessage = false;
    }
  };

  nonePopMessage = () => {
    this.popMessage = false;
  };

  updateStateImage = () => {
    var imageCurrent = <HTMLElement>(
      document.getElementById(`clickFavoriteImage`).children[1]
    );
    console.log(imageCurrent.id.split("_")[0]);
    var stateImageCurrent = <HTMLElement>(
      document.getElementById(`img_${this.UserProfile.id}`).children[
        Number(imageCurrent.id.split("_")[0])
      ]
    );
    console.log(stateImageCurrent.id);
    var liked = stateImageCurrent.id.split("_")[2];
    if (liked === "true") {
      this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].liked =
        true;
      this.imageService
        .likeImage(
          this.userInfo.id,
          this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].id
        )
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log("Khong like duoc hinh!");
        });
    } else {
      this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].liked =
        false;
      this.imageService
        .likeImage(
          this.userInfo.id,
          this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].id
        )
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log("Khong like duoc hinh!");
        });
    }
    console.log(this.imagesResponse);
  };

  updateAvatar = () => {
    var updateAvatar = <HTMLElement>document.getElementById("fileAvata");
    var mainUser = <HTMLElement>document.getElementById("changeAvatar");
    mainUser.className = "dropdown-menu";
    updateAvatar.click();
  };

  onUpdateAvatar(event) {
    if (event.target.files && event.target.files[0]) {
      this.usersService
        .UpdateAvatar(event.target.files[0])
        .then((data) => {
          this.UserProfile.avatarPath = data.avatarPath;
          this.userInfo.avatarPath = data.avatarPath;

          this.authenticationService.setUserInfo(this.userInfo);

          this.alertService.clear();
          this.alertService.success("Cập nhật avatar thành công!");
        })
        .catch((error) => console.log(error + "Err"));
    }
  }

  onViewFriendList() {
    this.isViewFriendList = !this.isViewFriendList;
    this.isViewImageList = false;
    this.editing = false;
    this.uploadImage = false;
    this.isSeenMoreImage = false;

    this.getFriendList();
  }

  isLoadingFriendList = false;
  isNoMoreFriend = false;

  getFriendList() {
    this.isLoadingFriendList = true;
    this.usersService
      .GetFollowers(this.currentUserId, this.pageIndex, this.pageSize)
      .then((data) => {
        if (data.length == 0) {
          this.isNoMoreFriend = true;
          return;
        }
        this.isLoadingFriendList = false;
        this.pageIndex += 1;
        this.FriendList = this.FriendList.concat(data);
      })
      .catch((error) => {
        this.isLoadingFriendList = false;
        this.alertService.clear();
        this.alertService.error("Có lỗi trong khi lấy danh sách bạn bè!");
      });
  }

  clickProfileUser = (id) => {
    this.isViewFriendList = false;
    this.uploadImage = false;
    this.editing = false;

    var url = this.router.url.split("/")[1];
    this.router.navigate(["/profile", id]);
    if (url === "profile") {
      setTimeout(() => {
        window.location.reload();
      }, 5);
    }
  };

  //seenAvatar = false;
  seenImageAvatar = () => {
    //this.seenAvatar = !this.seenAvatar
    var avatar = <HTMLElement>document.getElementById("imagePopAvatar");
    avatar.style.display = "block";
    var body = <HTMLElement>document.getElementsByTagName("body")[0];
    body.style.overflowY = "hidden";
    var mainUser = <HTMLElement>document.getElementById("changeAvatar");
    if (mainUser) mainUser.className = "dropdown-menu";
  };

  checkUserClickAvatar = () => {
    if (this.currentUserId !== this.userInfo.id) {
      this.seenImageAvatar();
    } else {
      var mainUser = <HTMLElement>document.getElementById("changeAvatar");
      mainUser.className = "dropdown-menu show";
    }
  };

  setInfomationBasics = () => {
    this.isViewInfomationBasics = !this.isViewInfomationBasics;
  };

  setInfomations = () => {
    this.isViewInfomations = !this.isViewInfomations;
  };

  setCharacters = () => {
    this.isViewCharaters = !this.isViewCharaters;
  };

  setLikes = () => {
    this.isViewLikes = !this.isViewLikes;
  };

  setActions = () => {
    this.isViewActions = !this.isViewActions;
  };

  blocking = false;
  clickBlockUser = (id, name) => {
    if (this.blocking) {
      return;
    }

    this.alertService.clear();

    if (this.UserProfile.blocked) {
      this.alertService.success(
        `Giờ đây, bạn và ${name} đã có thể tìm thấy nhau.`,
        this.options
      );
    } else {
      this.alertService.warn(
        `Bạn và ${name} sẽ không thể tìm thấy nhau trên ứng dụng!`
      );
    }
    this.UserProfile.blocked = !this.UserProfile.blocked;

    this.blocking = true;
    this.usersService
      .BlockUser(id)
      .then((response) => {
        console.log(response);
        this.blocking = false;
      })
      .catch((error) => {
        this.blocking = false;
        console.log(error);
      });
  };

  //blocking = false;
  onBlockUser = (item: User) => {
    if (this.blocking) {
      return;
    }

    this.alertService.clear();

    if (item.blocked) {
      this.alertService.success(
        `Giờ đây, bạn và ${item.fullName} đã có thể tìm thấy nhau.`,
        this.options
      );
    } else {
      this.alertService.warn(
        `Bạn và ${item.fullName} sẽ không thể tìm thấy nhau trên ứng dụng!`
      );
    }
    item.blocked = !item.blocked;
    this.blocking = true;
    this.usersService
      .BlockUser(item.id)
      .then((response) => {
        console.log(response);
        this.blocking = false;
      })
      .catch((error) => {
        this.blocking = false;
        console.log(error);
      });
  };

  onViewBlockList() {
    this.isViewFriendList = false;
    this.isViewImageList = false;
    this.editing = false;
    this.uploadImage = false;
    this.isSeenMoreImage = false;
    //if (this.checkExistObject(this.BlockList) == false) {
    this.usersService
      .GetBlockList()
      .then((data) => {
        this.BlockList = data;
        this.BlockList.forEach((item) => {
          item.blocked = true;
        });
        console.log(this.BlockList);
      })
      .catch((error) => {
        console.log(error);
        this.alertService.clear();
        this.alertService.error("Có lỗi trong khi lấy danh sách block!");
      });
    //}
  }

  onSaveRelationship() {
    this.usersService
      .CreateRelationship(
        this.userInfo.id,
        this.currentUserId,
        this.relationship.relationshipType
      )
      .subscribe(
        (data) => {
          console.log(data);
          this.alertService.success("Tạo quan hệ thành công");
        },
        (err) => {
          this.alertService.error("Không thể tạo mối quan hệ");
        }
      );
  }

  iconSummaryEvent(event: any) {
    this.UserProfile.summary += event;
  }

  iconTitleEvent(event: any) {
    this.UserProfile.title += event;
  }

  iconImageEvent(event: any) {
    this.imageTitle += event;
  }
}
