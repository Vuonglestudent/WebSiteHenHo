import { AlertService } from './../_alert/alert.service';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { UsersService } from '../service/users.service';
import { User, ProfileData, Image } from '../Models/Models';
import { AuthenticationService } from '../signup/authentication.service';
import { NgForm } from '@angular/forms';
import { ImageService } from './../service/image.service';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit, AfterViewInit {

    nameUser = 'Lê Quốc Nguyên Vương'
    ageUser = '20'
    addressUser = 'Đường số 8, Linh Trung, Thủ đức'
    imgAvatar = "./assets/img/theme/team-3-800x800.jpg"
    imgArray = 10
    friends = 22
    editing: boolean = false;
    imageTitle: string;
    checkUser = false;
    imagesResponse: Array<Image>;
    //icon
    faSpinner = faSpinner;

    imageCarousel = [
        { title: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-1-800x800.jpg' },
        { title: 'Second slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-2-800x800.jpg' },
        { title: 'Third slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-3-800x800.jpg' },
    ]

    profileData: ProfileData = new ProfileData();
    public UserProfile: User = new User();

    constructor(
        private usersService: UsersService,
        private authenticationService: AuthenticationService,
        private imageService: ImageService,
        private alertService: AlertService,
        private el: ElementRef,
        private route: ActivatedRoute
    ) {
        this.route.paramMap.subscribe(params => {
            this.ngOnInit();
        });
    }
    ngAfterViewInit(): void {
        if(!this.authenticationService.UserInfo.IsInfoUpdated){
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

    ngOnInit() {
        if (this.route.snapshot.paramMap.get('id') === this.authenticationService.UserInfo.Id) {
            this.checkUser = true;
        } else {
            this.checkUser = false;
        }
        this.usersService.GetById(this.route.snapshot.paramMap.get('id'))
            .then(data => {
                console.log('this is data');
                console.log(data);
                this.UserProfile = data;
                this.UserProfile.profile.dob = (this.UserProfile.profile.dob).split('T')[0]
                console.log(this.UserProfile, this.UserProfile.profile.dob);
                this.replaceCharacter(this.UserProfile);
                console.log(this.UserProfile);
            })
            .catch(error => {
                alert("không lấy được không tin!");
                console.log(error);
            })

        this.usersService.GetProfileData()
            .then(data => {
                console.log(data);
                this.profileData = data;
            })
            .catch(error => {
                alert(error);
                console.log(error);
            })

        this.onViewImage()
    }
    updating: boolean = false;
    onUpdateInfo() {
        this.updating = true;
        var updateProfile = this.UserProfile;
        this.reReplaceCharacter(updateProfile);
        this.usersService.UpdateProfile(updateProfile)
            .then(data => {
                this.updating = false;
                this.UserProfile = data;
                var oldInfo = {
                    numberOfFollowing: this.UserProfile.numberOfFavoriting,
                    numberOfFollowers: this.UserProfile.numberOfFollowers,
                    numberOfFavoriting: this.UserProfile.numberOfFavoriting,
                    numberOfFavoritors: this.UserProfile.numberOfFavoritors,
                    numberOfImages: this.UserProfile.numberOfImages
                };
                this.UserProfile.numberOfFollowing = oldInfo.numberOfFollowing;
                this.UserProfile.numberOfFollowers = oldInfo.numberOfFollowers;
                this.UserProfile.numberOfFavoriting = oldInfo.numberOfFavoriting;
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

    checkFavourite = (e) => {
        var target = e.target;
        var child = target.children[0]
        if (child.className == 'ni ni-favourite-28') {
            child.setAttribute('class', 'ni ni-favourite-28 text-danger')
            this.UserProfile.numberOfFavoriting = this.UserProfile.numberOfFavoriting + 1;
        } else {
            child.setAttribute('class', 'ni ni-favourite-28')
            this.UserProfile.numberOfFavoriting = this.UserProfile.numberOfFavoriting - 1;
        }
    }

    clickFollow = (e) => {
        var target = e.target;
        if (target.innerHTML == 'Theo dõi') {
            target.className = 'btn btn-sm btn-danger mr-4';
            target.innerHTML = 'Hủy theo dõi';
            this.friends = this.friends + 1;
        } else {
            target.className = 'btn btn-sm btn-info mr-4'
            target.innerHTML = 'Theo dõi'
            this.friends = this.friends - 1;
        }
    }

    clickEdit = () => {
        this.editing = !this.editing;
    }

    arrayNumbers(n: number, startFrom: number): number[] {
        return [...Array(n).keys()].map(i => i + startFrom);
    }

    files: File[] = [];
    uploadImage: boolean = false;

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
    }

    onRemove(event) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }

    uploadImages() {
        this.uploadImage = !this.uploadImage;
    }
    uploadStatus: string = 'none';
    onUpload() {
        this.uploadStatus = 'loading';
        this.imageService.addImages(this.authenticationService.UserInfo.Id, this.files, this.imageTitle)
            .then(data => {
                this.uploadStatus = 'none';
                this.alertService.clear();
                this.alertService.success("Đăng ảnh thành công!", this.options);
                this.files = [];
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

    replaceCharacter = (userProfile: User) => {
        userProfile.profile.findPeople = userProfile.profile.findPeople.replace(/_/g, " ");
        userProfile.profile.job = userProfile.profile.job.replace(/_/g, " ");
        userProfile.profile.location = userProfile.profile.location.replace(/_/g, " ");
        userProfile.profile.marriage = userProfile.profile.marriage.replace(/_/g, " ");
        userProfile.profile.target = userProfile.profile.target.replace(/_/g, " ");
        userProfile.profile.education = userProfile.profile.education.replace(/_/g, " ");
        userProfile.profile.body = userProfile.profile.body.replace(/_/g, " ");
        userProfile.profile.character = userProfile.profile.character.replace(/_/g, " ");
        userProfile.profile.lifeStyle = userProfile.profile.lifeStyle.replace(/_/g, " ");
        userProfile.profile.mostValuable = userProfile.profile.mostValuable.replace(/_/g, " ");
        userProfile.profile.religion = userProfile.profile.religion.replace(/_/g, " ");
        userProfile.profile.favoriteMovie = userProfile.profile.favoriteMovie.replace(/_/g, " ");
        userProfile.profile.atmosphereLike = userProfile.profile.atmosphereLike.replace(/_/g, " ");
        userProfile.profile.smoking = userProfile.profile.smoking.replace(/_/g, " ");
        userProfile.profile.smoking = userProfile.profile.religion.replace(/_/g, " ");
        userProfile.profile.drinkBeer = userProfile.profile.drinkBeer.replace(/_/g, " ");
    };

    reReplaceCharacter = (userProfile: User) => {
        userProfile.profile.findPeople = userProfile.profile.findPeople.replace(/ /g, "_");
        userProfile.profile.job = userProfile.profile.job.replace(/ /g, "_");
        userProfile.profile.location = userProfile.profile.location.replace(/ /g, "_");
        userProfile.profile.marriage = userProfile.profile.marriage.replace(/ /g, "_");
        userProfile.profile.target = userProfile.profile.target.replace(/ /g, "_");
        userProfile.profile.education = userProfile.profile.education.replace(/ /g, "_");
        userProfile.profile.body = userProfile.profile.body.replace(/ /g, "_");
        userProfile.profile.character = userProfile.profile.character.replace(/ /g, "_");
        userProfile.profile.lifeStyle = userProfile.profile.lifeStyle.replace(/ /g, "_");
        userProfile.profile.mostValuable = userProfile.profile.mostValuable.replace(/ /g, "_");
        userProfile.profile.religion = userProfile.profile.religion.replace(/ /g, " ");
        userProfile.profile.favoriteMovie = userProfile.profile.favoriteMovie.replace(/ /g, "_");
        userProfile.profile.atmosphereLike = userProfile.profile.atmosphereLike.replace(/ /g, "_");
        userProfile.profile.smoking = userProfile.profile.smoking.replace(/ /g, "_");
        userProfile.profile.drinkBeer = userProfile.profile.drinkBeer.replace(/ /g, "_");
        userProfile.profile.drinkBeer = userProfile.profile.religion.replace(/ /g, "_");
    };
}
