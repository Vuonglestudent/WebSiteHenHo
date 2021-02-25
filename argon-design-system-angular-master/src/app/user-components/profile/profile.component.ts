import {  FeatureVM } from '../../models/models';
import { MessageService } from './../../service/message.service';
import { AlertService } from './../../_alert/alert.service';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from '../../service/users.service';
import { User, ProfileData, Image } from '../../models/models';
import { AuthenticationService } from '../signup/authentication.service';
import { NgForm } from '@angular/forms';
import { ImageService } from './../../service/image.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { slideInOutAnimation } from '../../_animates/animates';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    animations: [slideInOutAnimation],

    // attach the slide in/out animation to the host (root) element of this component
    host: { '[@slideInOutAnimation]': '' },
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, AfterViewInit {

    nameUser = 'Lê Quốc Nguyên Vương'
    ageUser = '20'
    addressUser = 'Đường số 8, Linh Trung, Thủ đức'
    imgAvatar = "./assets/img/theme/team-3-800x800.jpg"

    editing: boolean = false;
    imageTitle: string;
    checkUser = false;
    imagesResponse: Array<Image>;
    isViewFriendList: boolean = false;
    FriendList: Array<User>;
    BlockList: Array<User>;
    //icon
    faSpinner = faSpinner;
    currentUserId;
    //profile user
    isViewInfomationBasics = false;
    isViewInfomations = false;
    isViewCharaters = false;
    isViewLikes = false;
    isViewActions = false;
    isViewBlockList = false;

    profileData: ProfileData = new ProfileData();
    public UserProfile: User = new User();
    isViewImageList = false
    constructor(
        private usersService: UsersService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private el: ElementRef,
        private router: Router,
        private route: ActivatedRoute,
        private messageService: MessageService,
        private imageService: ImageService
    ) {
        this.route.paramMap.subscribe(params => {
            this.ngOnInit();
        });
    }

    ngAfterViewInit(): void {
        if (!this.authenticationService.UserInfo.IsInfoUpdated) {
            this.editing = true;
            this.alertService.clear();
            this.alertService.warn('Vui lòng cập nhật hồ sơ để tiếp tục sử dụng ứng dụng!');
            return;
        }
    }

    options = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    Features: FeatureVM[] = new Array();
    SearchFeatures: FeatureVM[] = new Array();
    UpdateFeatures = new Array();
    isYourself = false;
    ngOnInit() {
        this.currentUserId = this.route.snapshot.paramMap.get('id');
        if (this.route.snapshot.paramMap.get('id') === this.authenticationService.UserInfo.Id) {
            this.checkUser = true;
        } else {
            this.checkUser = false;
        }
        this.usersService.GetById(this.route.snapshot.paramMap.get('id'))
            .then(data => {
                this.UserProfile = data;
                console.log('Day la USER PROFILE')
                console.log(this.UserProfile)
                this.Features = this.UserProfile.features;
                this.SearchFeatures = this.UserProfile.searchFeatures;

                this.UserProfile.dob = (this.UserProfile.dob).split('T')[0]

                /////
                this.usersService.GetProfileData()
                    .then(data => {
                        this.profileData = data;
                        console.log('day la profile data')
                        console.log(this.profileData)

                        for (let i = 0; i < this.profileData.features.length; i++) {
                            var isExist = false;
                            for (let j = 0; j < this.Features.length; j++) {
                                if (this.profileData.features[i].id === this.Features[j].featureId) {
                                    isExist = true;
                                    this.Features[j].featureDetails = this.profileData.features[i].featureDetails;
                                    break;
                                }
                            }
                            if (!isExist) {
                                if(this.CheckNonFeature(this.profileData.features[i].id)){
                                    continue;
                                }
                                var feature = new FeatureVM();
                                feature.featureId = this.profileData.features[i].id;
                                feature.featureDetailId = -1;
                                feature.name = this.profileData.features[i].name;
                                feature.content = 'CHƯA CẬP NHẬT!';
                                feature.isSearchFeature = this.profileData.features[i].isSearchFeature;
                                feature.featureDetails = this.profileData.features[i].featureDetails;
                                this.Features.push(feature);
                            }
                        }

                        for (let i = 0; i < this.profileData.features.length; i++) {
                            if (!this.profileData.features[i].isSearchFeature) {
                                continue;
                            }
                            var isExist = false;
                            for (let j = 0; j < this.SearchFeatures.length; j++) {
                                if (this.profileData.features[i].id === this.SearchFeatures[j].featureId) {
                                    isExist = true;
                                    this.SearchFeatures[j].featureDetails = this.profileData.features[i].featureDetails;
                                    break;
                                }
                            }
                            if (!isExist) {
                                if(this.CheckNonSearchFeature(this.profileData.features[i].id)){
                                    continue;
                                }
                                var feature = new FeatureVM();
                                feature.featureId = this.profileData.features[i].id;
                                feature.featureDetailId = -1;
                                feature.name = this.profileData.features[i].name;
                                feature.content = 'CHƯA CẬP NHẬT!';
                                feature.isSearchFeature = this.profileData.features[i].isSearchFeature;
                                feature.featureDetails = this.profileData.features[i].featureDetails;
                                this.SearchFeatures.push(feature);
                            }
                        }

                        // this.UpdateFeatures = new Array();
                        // this.UserProfile.features.forEach(element => {
                        //     var feature = {
                        //         featureId: element.featureId,
                        //         featureDetailId: element.featureDetailId
                        //     }
                        //     this.UpdateFeatures.push(feature);
                        //     this.profileData.features.forEach(item => {
                        //         if(element.featureId === item.id){
                        //             var dt = new FeatureDetail();
                        //             dt.content = element.content;
                        //             dt.id = element.featureDetailId;
                        //             item.featureDetails.unshift(dt);
                        //         }
                        //     });
                        // });
                        console.log(this.SearchFeatures);
                        this.profileData.job.unshift(this.UserProfile.job);
                        this.profileData.location.unshift(this.UserProfile.location);
                    })
                    .catch(error => {
                        alert(error);
                        console.log(error);
                    })
            })
            .catch(error => {
                alert("không lấy được không tin!");
                console.log(error);
            })

        this.onViewImage()
        if(this.authenticationService.UserInfo.Id == this.currentUserId){
            this.onViewFriendList();
            this.isYourself = true;
        }
    }

    CheckNonFeature(featureId:number){
        for (let i = 0; i < this.Features.length; i++) {
            if(this.Features[i].featureId === featureId){
                return true;
            }
        }
        return false;
    }

    CheckNonSearchFeature(featureId:number){
        for (let i = 0; i < this.SearchFeatures.length; i++) {
            if(this.SearchFeatures[i].featureId === featureId){
                return true;
            }
        }
        return false;
    }

    isSeenMoreImage = false;
    clickSeenMoreImage = () => {
        this.isSeenMoreImage = !this.isSeenMoreImage
    }

    viewImageList = () => {
        this.isViewImageList = !this.isViewImageList
        this.isViewBlockList = false;
        this.isSeenMoreImage = false;
        this.isViewFriendList = false;
        this.editing = false;
        this.uploadImage = false;
    }
    updating: boolean = false;
    onUpdateInfo() {
        this.updating = true;
        var updateProfile = this.UserProfile;
        this.usersService.UpdateProfile(updateProfile, this.Features, this.SearchFeatures)
            .then(data => {
                this.updating = false;
                this.UserProfile = data;

                var oldInfo = {
                    numberOfFollowers: this.UserProfile.numberOfFollowers,
                    numberOfFavoritors: this.UserProfile.numberOfFavoritors,
                    numberOfImages: this.UserProfile.numberOfImages
                };
                this.UserProfile.numberOfFollowers = oldInfo.numberOfFollowers;
                this.UserProfile.numberOfFavoritors = oldInfo.numberOfFavoritors;
                this.UserProfile.numberOfImages = oldInfo.numberOfImages;

                this.alertService.clear();
                this.alertService.success("Cập nhật hồ sơ thành công!");
                this.editing = false;
                this.authenticationService.UserInfo.IsInfoUpdated = true;
            })
            .catch(error => {
                this.updating = false;
                this.alertService.clear();
                this.alertService.error(error.error.message, this.options);
            })
    }

    onOptionsSearchFeatureSelected(event, index: number) {
        const value = event.target.value;
        console.log(value);
        for (let i = 0; i < this.profileData.features.length; i++) {
            if (this.profileData.features[i].id === this.SearchFeatures[index].featureId) {
                for (let j = 0; j < this.profileData.features[i].featureDetails.length; j++) {
                    if (this.profileData.features[i].featureDetails[j].id == value) {
                        this.SearchFeatures[index].content = this.profileData.features[i].featureDetails[j].content;

                        this.SearchFeatures[index].featureDetailId = this.profileData.features[i].featureDetails[j].id;

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
                for (let j = 0; j < this.profileData.features[i].featureDetails.length; j++) {
                    if (this.profileData.features[i].featureDetails[j].id == value) {
                        this.Features[index].content = this.profileData.features[i].featureDetails[j].content;

                        this.Features[index].featureDetailId = this.profileData.features[i].featureDetails[j].id;

                    }
                }
            }

        }
    }

    clickFavourite = () => {
        this.UserProfile.favorited = !this.UserProfile.favorited;
        this.UserProfile.favorited == false ? this.UserProfile.numberOfFavoritors-- : this.UserProfile.numberOfFavoritors++;
        this.usersService.Favorite(this.currentUserId)
            .then(data => console.log(data))
            .catch(error => console.log('can not favorite'))
    }

    clickFollow = (e) => {
        this.UserProfile.followed = !this.UserProfile.followed;
        this.usersService.Follow(this.currentUserId)
            .then(data => console.log(data))
            .catch(error => console.log('Can not follow'))
    }

    clickEdit = () => {
        this.editing = !this.editing;
        this.isViewBlockList = false;
        this.uploadImage = false;
        this.isViewFriendList = false;
        this.isViewImageList = false;
    }

    arrayNumbers(n: number, startFrom: number): number[] {
        return [...Array(n).keys()].map(i => i + startFrom);
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
        this.isViewBlockList = false;
        this.editing = false;
        this.isViewImageList = false;
        this.isViewFriendList = false;
    }
    uploadStatus: string = 'none';
    onUpload() {
        this.uploadStatus = 'loading';
        this.imageService.addImages(this.authenticationService.UserInfo.Id, this.files, this.imageTitle)
            .then(response => {
                this.uploadStatus = 'none';
                this.alertService.clear();
                if(response.approved){
                    this.alertService.success(response.message, this.options);
                }
                else{
                    this.alertService.warn(response.message, this.options);
                }
                this.files = [];
                this.ngOnInit();
                this.uploadImage = !this.uploadImage;
            })
            .catch(error => {
                this.uploadStatus = 'none';
                this.alertService.clear();
                this.alertService.error("Có lỗi khi upload ảnh!", this.options);
            })
    }

    onViewImage = () => {
        this.imageService.getImageByUserId(this.route.snapshot.paramMap.get('id'))
            .then(data => {
                console.log(data)
                this.imagesResponse = data;
            })
            .catch(error => {
                this.alertService.clear();
                this.alertService.error("Có lỗi khi tải hình ảnh!");
            })
    }

    // replaceCharacter = (userProfile: User) => {
    //     userProfile.profile.findPeople = userProfile.profile.findPeople.replace(/_/g, " ");
    //     userProfile.profile.job = userProfile.profile.job.replace(/_/g, " ");
    //     userProfile.profile.location = userProfile.profile.location.replace(/_/g, " ");
    //     userProfile.profile.marriage = userProfile.profile.marriage.replace(/_/g, " ");
    //     userProfile.profile.target = userProfile.profile.target.replace(/_/g, " ");
    //     userProfile.profile.education = userProfile.profile.education.replace(/_/g, " ");
    //     userProfile.profile.body = userProfile.profile.body.replace(/_/g, " ");
    //     userProfile.profile.character = userProfile.profile.character.replace(/_/g, " ");
    //     userProfile.profile.lifeStyle = userProfile.profile.lifeStyle.replace(/_/g, " ");
    //     userProfile.profile.mostValuable = userProfile.profile.mostValuable.replace(/_/g, " ");
    //     userProfile.profile.religion = userProfile.profile.religion.replace(/_/g, " ");
    //     userProfile.profile.favoriteMovie = userProfile.profile.favoriteMovie.replace(/_/g, " ");
    //     userProfile.profile.atmosphereLike = userProfile.profile.atmosphereLike.replace(/_/g, " ");
    //     userProfile.profile.smoking = userProfile.profile.smoking.replace(/_/g, " ");
    //     userProfile.profile.religion = userProfile.profile.religion.replace(/_/g, " ");
    //     userProfile.profile.drinkBeer = userProfile.profile.drinkBeer.replace(/_/g, " ");
    //     userProfile.profile.cook = userProfile.profile.cook.replace(/_/g, " ");
    //     userProfile.profile.likeTechnology = userProfile.profile.likeTechnology.replace(/_/g, " ");
    //     userProfile.profile.likePet = userProfile.profile.likePet.replace(/_/g, " ");
    //     userProfile.profile.playSport = userProfile.profile.playSport.replace(/_/g, " ");
    //     userProfile.profile.travel = userProfile.profile.travel.replace(/_/g, " ");
    //     userProfile.profile.game = userProfile.profile.game.replace(/_/g, " ");
    //     userProfile.profile.shopping = userProfile.profile.shopping.replace(/_/g, " ");
    // };

    // reReplaceCharacter = (userProfile: User) => {
    //     userProfile.profile.findPeople = userProfile.profile.findPeople.replace(/ /g, "_");
    //     userProfile.profile.job = userProfile.profile.job.replace(/ /g, "_");
    //     userProfile.profile.location = userProfile.profile.location.replace(/ /g, "_");
    //     userProfile.profile.marriage = userProfile.profile.marriage.replace(/ /g, "_");
    //     userProfile.profile.target = userProfile.profile.target.replace(/ /g, "_");
    //     userProfile.profile.education = userProfile.profile.education.replace(/ /g, "_");
    //     userProfile.profile.body = userProfile.profile.body.replace(/ /g, "_");
    //     userProfile.profile.character = userProfile.profile.character.replace(/ /g, "_");
    //     userProfile.profile.lifeStyle = userProfile.profile.lifeStyle.replace(/ /g, "_");
    //     userProfile.profile.mostValuable = userProfile.profile.mostValuable.replace(/ /g, "_");
    //     userProfile.profile.religion = userProfile.profile.religion.replace(/ /g, "_");
    //     userProfile.profile.favoriteMovie = userProfile.profile.favoriteMovie.replace(/ /g, "_");
    //     userProfile.profile.atmosphereLike = userProfile.profile.atmosphereLike.replace(/ /g, "_");
    //     userProfile.profile.smoking = userProfile.profile.smoking.replace(/ /g, "_");
    //     userProfile.profile.drinkBeer = userProfile.profile.drinkBeer.replace(/ /g, "_");
    //     userProfile.profile.marriage = userProfile.profile.marriage.replace(/_/g, "_");

    //     userProfile.profile.cook = userProfile.profile.cook.replace(/ /g, "_");
    //     userProfile.profile.likeTechnology = userProfile.profile.likeTechnology.replace(/ /g, "_");
    //     userProfile.profile.likePet = userProfile.profile.likePet.replace(/ /g, "_");
    //     userProfile.profile.playSport = userProfile.profile.playSport.replace(/ /g, "_");
    //     userProfile.profile.travel = userProfile.profile.travel.replace(/ /g, "_");
    //     userProfile.profile.game = userProfile.profile.game.replace(/ /g, "_");
    //     userProfile.profile.shopping = userProfile.profile.shopping.replace(/ /g, "_");
    // };

    // standardizedProfileData() {
    //     var temp = [];
    //     this.profileData.atmosphereLike.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.atmosphereLike = temp;

    //     temp = [];
    //     this.profileData.body.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.body = temp;

    //     temp = [];
    //     this.profileData.character.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.character = temp;

    //     temp = [];
    //     this.profileData.cook.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.cook = temp;

    //     temp = [];
    //     this.profileData.drinkBeer.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.drinkBeer = temp;

    //     temp = [];
    //     this.profileData.education.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.education = temp;

    //     temp = [];
    //     this.profileData.favoriteMovie.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.favoriteMovie = temp;

    //     temp = [];
    //     this.profileData.findPeople.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.findPeople = temp;

    //     temp = [];
    //     this.profileData.game.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.game = temp;

    //     temp = [];
    //     this.profileData.gender.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.gender = temp;

    //     temp = [];
    //     this.profileData.job.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.job = temp;

    //     temp = [];
    //     this.profileData.lifeStyle.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.lifeStyle = temp;

    //     temp = [];
    //     this.profileData.likePet.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.likePet = temp;

    //     temp = [];
    //     this.profileData.likeTechnology.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.likeTechnology = temp;

    //     temp = [];
    //     this.profileData.location.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.location = temp;

    //     temp = [];
    //     this.profileData.marriage.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.marriage = temp;

    //     temp = [];
    //     this.profileData.mostValuable.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.mostValuable = temp;

    //     temp = [];
    //     this.profileData.playSport.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.playSport = temp;

    //     temp = [];
    //     this.profileData.shopping.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.shopping = temp;

    //     temp = [];
    //     this.profileData.religion.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.religion = temp;

    //     temp = [];
    //     this.profileData.smoking.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.smoking = temp;

    //     temp = [];
    //     this.profileData.target.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.target = temp;

    //     temp = [];
    //     this.profileData.typeAccount.forEach(element => {
    //         element = element.replace(/_/g, " ");
    //         temp.push(element);
    //     });
    //     this.profileData.typeAccount = temp;

    //     temp = [];
    // }

    popMessage = false
    popTextAreaMessage = () => {
        this.popMessage = true;
    }

    txtMessage = ''
    sendMessage = (id) => {
        //this.router.navigate(['/chat', id])
        console.log(id, this.txtMessage)
        if (this.txtMessage != '') {
            this.messageService.SendMessage(this.authenticationService.UserInfo.Id, id, this.txtMessage)
                .then(data => {
                    console.log(data)
                    this.alertService.clear();
                    this.alertService.success('Tin nhắn của bạn đã được gửi đến ' + this.UserProfile.fullName, this.options);
                })
                .catch(error => {
                    console.log(error)
                });
            this.txtMessage = '';
            this.popMessage = false;
        }
    }

    nonePopMessage = () => {
        this.popMessage = false
    }

    updateStateImage = () => {
        var imageCurrent = <HTMLElement>document.getElementById(`clickFavoriteImage`).children[1]
        console.log(imageCurrent.id.split("_")[0])
        var stateImageCurrent = <HTMLElement>document.getElementById(`img_${this.UserProfile.id}`).children[Number(imageCurrent.id.split("_")[0])]
        console.log(stateImageCurrent.id)
        var liked = stateImageCurrent.id.split("_")[2]
        if (liked === "true") {
            this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].liked = true;
            this.imageService.likeImage(this.authenticationService.UserInfo.Id, this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].id)
                .then(data => {
                    console.log(data);

                })
                .catch(error => {
                    console.log('Khong like duoc hinh!');
                })


        } else {
            this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].liked = false;
            this.imageService.likeImage(this.authenticationService.UserInfo.Id, this.imagesResponse[Number(imageCurrent.id.split("_")[0]) - 1].id)
                .then(data => {
                    console.log(data);

                })
                .catch(error => {
                    console.log('Khong like duoc hinh!');
                })
        }
        console.log(this.imagesResponse)
    }

    updateAvatar = () => {
        var updateAvatar = <HTMLElement>document.getElementById('fileAvata')
        var mainUser = <HTMLElement>document.getElementById('changeAvatar')
        mainUser.className = 'dropdown-menu'
        updateAvatar.click()
    }

    onUpdateAvatar(event) {
        if (event.target.files && event.target.files[0]) {
            this.usersService.UpdateAvatar(event.target.files[0])
                .then(data => {
                    this.UserProfile.avatarPath = data.avatarPath;

                    this.authenticationService.UserInfo.hasAvatar = true;
                    this.authenticationService.UserInfo.avatarPath = data.avatarPath;
                    localStorage.setItem('UserInfo', JSON.stringify(this.authenticationService.UserInfo));

                    this.alertService.clear();
                    this.alertService.success('Cập nhật avatar thành công!');
                })
                .catch(error => console.log(error + 'Err'))
        }
    }

    onViewFriendList() {
        this.isViewFriendList = !this.isViewFriendList;
        this.isViewBlockList = false;
        this.isViewImageList = false;
        this.editing = false;
        this.uploadImage = false;
        this.isSeenMoreImage = false;
        //if (this.checkExistObject(this.FriendList) == false) {
        this.usersService.GetFollowers(this.currentUserId)
            .then(data => {
                this.FriendList = data;
            })
            .catch(error => {
                this.alertService.clear();
                this.alertService.error('Có lỗi trong khi lấy danh sách bạn bè!');
            })
        //}
    }
    clickProfileUser = (id) => {
        this.isViewBlockList = false;
        this.isViewFriendList = false;
        this.uploadImage = false;
        this.editing = false;
        this.router.navigate(['/profile', id]);

    }

    //seenAvatar = false;
    seenImageAvatar = () => {
        //this.seenAvatar = !this.seenAvatar
        var avatar = <HTMLElement>document.getElementById('imagePopAvatar')
        avatar.style.display = "block";
        var body = <HTMLElement>document.getElementsByTagName("body")[0]
        body.style.overflowY = "hidden";
        var mainUser = <HTMLElement>document.getElementById('changeAvatar')
        mainUser.className = 'dropdown-menu'
    }

    checkUserClickAvatar = () => {
        if (this.currentUserId !== this.authenticationService.UserInfo.Id) {
            this.seenImageAvatar()
        } else {
            var mainUser = <HTMLElement>document.getElementById('changeAvatar')
            mainUser.className = 'dropdown-menu show'
        }
    }

    setInfomationBasics = () => {
        this.isViewInfomationBasics = !this.isViewInfomationBasics;
    }

    setInfomations = () => {
        this.isViewInfomations = !this.isViewInfomations;
    }

    setCharacters = () => {
        this.isViewCharaters = !this.isViewCharaters;
    }

    setLikes = () => {
        this.isViewLikes = !this.isViewLikes;
    }

    setActions = () => {
        this.isViewActions = !this.isViewActions;
    }

    clickBlockUser = () => {
        this.UserProfile.blocked = !this.UserProfile.blocked;
        this.usersService.BlockUser(this.UserProfile.id)
            .then(response => console.log(response))
            .catch(error => console.log(error));
    }

    onViewBlockList() {
        this.isViewBlockList = !this.isViewBlockList;
        this.isViewFriendList = false;
        this.isViewImageList = false;
        this.editing = false;
        this.uploadImage = false;
        this.isSeenMoreImage = false;
        //if (this.checkExistObject(this.BlockList) == false) {
        this.usersService.GetBlockList()
            .then(data => {
                this.BlockList = data;
            })
            .catch(error => {
                console.log(error);
                this.alertService.clear();
                this.alertService.error('Có lỗi trong khi lấy danh sách block!');
            })
        //}
    }

    // checkExistObject = (obj) => {
    //     if (obj != null) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}

