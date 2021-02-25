import { ImageService } from '../../service/image.service';
import { ImageUser, User, News } from '../../models/models';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';
import { UsersService } from '../../service/users.service';
import { AlertService } from '../../_alert';
import { AuthenticationService } from '../signup/authentication.service';
import { fadeInAnimation } from '../../_animates/animates';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private usersService: UsersService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private imageService: ImageService,
        private messageService: MessageService,
    ) { }

    faSpinner = faSpinner;

    options = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    files: File[] = [];

    // Phân trang user
    PageIndexNewUser = 1;
    PageSizeNewUser = 10;

    // LoadImageUser

    PageIndexImage = 1;
    PageSizeImage = 10;
    //
    clickSeenImageUser
    Loading = false;
    clickSeenImage = 0;
    ngOnInit() {
        this.updatePagingNumber(this.usersService.FavoritePage.index);

        if (this.authenticationService.UserInfo != null) {
            if (this.usersService.Favoritors.length == 0 || !this.usersService.IsGetSimilarityUsers) {
                this.getSimilarUSer(false);
                this.usersService.IsGetSimilarityUsers = true;
            }
        }
        else {
            this.getFavoritors();
        }

        if (this.usersService.NewUsers.length == 0) {
            this.usersService.GetNewUsers(this.PageIndexNewUser, this.PageSizeNewUser)
                .then(response => {
                    this.usersService.NewUsers = response;

                })
                .catch(error => {
                    this.alertService.clear();
                    this.alertService.error("Lỗi server!", this.options);
                })
        }
        this.LoadFilterData();
        this.GetNewImages(this.PageIndexImage, this.PageSizeImage);
    }

    onSeeMoreImage = () =>{
        this.PageIndexImage += 1;
        this.GetNewImages(this.PageIndexImage, this.PageSizeImage);
    }

    filter = {
        location: '',
        fromAge: 0,
        toAge: 0,
        gender: '',

    }
    getSimilarUSer = (filter: boolean) => {
        this.Loading = true;
        this.usersService.GetSimilarUSer(this.authenticationService.UserInfo.Id, this.usersService.FavoritePage.index, this.usersService.FavoritePage.size, filter, this.location, this.name, this.fromAge, this.toAge, this.gender)
            .then(response => {
                this.Loading = false;
                this.usersService.Favoritors = response.data;
                this.usersService.FavoritePage.total = response.pageTotal;
                this.usersService.Favoritors.forEach(element => {
                    this.imageService.getImageByUserId(element.id)
                        .then(data => {
                            const imageUser = {} as ImageUser
                            imageUser.id = element.id;
                            imageUser.images = data;
                            this.usersService.imageUsers.push(imageUser)
                        })
                        .catch(error => {
                            this.alertService.clear();
                            this.alertService.error("Có lỗi khi tải hình ảnh!");
                        })
                });
            })
            .catch(error => console.log(error))

    }

    getFavoritors() {
        this.Loading = true;
        this.usersService.GetFavoritest(this.usersService.FavoritePage.index, this.usersService.FavoritePage.size)
            .then(response => {
                this.Loading = false;
                this.usersService.Favoritors = response.data;
                this.usersService.FavoritePage.total = response.pageTotal;

                this.usersService.Favoritors.forEach(element => {
                    this.imageService.getImageByUserId(element.id)
                        .then(data => {
                            const imageUser = {} as ImageUser
                            imageUser.id = element.id;
                            imageUser.images = data;
                            this.usersService.imageUsers.push(imageUser)
                        })
                        .catch(error => {
                            this.alertService.clear();
                            this.alertService.error("Có lỗi khi tải hình ảnh!");
                        })
                });
            })
            .catch(error => {
                //this.Loading = false;
                this.alertService.clear();
                this.alertService.error("Lỗi server, vui lòng thử lại sau!", this.options);
            })

    }

    updatePagingNumber(page: number) {

        this.usersService.FavoritePage.index = page;
        if (page == 1) {
            this.usersService.FavoritePage.position = 1;
            this.usersService.FavoritePage.current = 2;
        }
        else if (page == this.usersService.FavoritePage.total) {
            this.usersService.FavoritePage.position = 3;
            this.usersService.FavoritePage.current = page - 1;
        }
        else {
            this.usersService.FavoritePage.position = 2;
            this.usersService.FavoritePage.current = page;
        }
    };

    ngAfterViewInit(): void {

        if (this.authenticationService.UserInfo != null) {
            if (!this.authenticationService.UserInfo.IsInfoUpdated) {
                this.router.navigate(['/profile', this.authenticationService.UserInfo.Id]);
                return;
            }
        }

    }
    GetUserInfo = (userId: string) => {
        this.alertService.clear();
        this.alertService.success('OK', this.options);

    }
    likeProcessing = false;
    Favorite = (userId: string, event) => {

        if (!this.authenticationService.IsLogin) {
            this.LoginRequired();
            return;
        }
        if (this.likeProcessing == true) {
            return;
        }
        this.likeProcessing = true;

        var target = event.target;
        var favouritesCurrent = Number(target.innerText)
        this.usersService.Favorite(userId)
            .then(response => {
                this.likeProcessing = false;
                // this.alertService.clear();
                // this.alertService.success(response.message, this.options);
                if (response.message == 'Favorited') {
                    target.className = 'ni ni-favourite-28 text-danger'
                    target.innerHTML = `<span><small class="text-dark" style="font-size: 60%;">${favouritesCurrent + 1}</small></span>`
                } else {
                    target.className = 'ni ni-favourite-28'
                    target.innerHTML = `<span><small class="text-dark" style="font-size: 60%;">${favouritesCurrent - 1}</small></span>`
                }
            })
            .catch(error => {
                this.likeProcessing = false;
                if (error.status == 401) {
                    this.LoginRequired();
                    return;
                }
                this.alertService.clear();
                this.alertService.error(error.error.message, this.options);
            })
    }


    LoginRequired = () => {
        this.alertService.clear();
        this.alertService.warn("Vui lòng đăng nhập để tiếp tục!", this.options);
        // setTimeout(() => {
        //     this.router.navigateByUrl('/login');
        // }, 3000);
    }

    count = 0;
    imageCarousel = [
        { title: '', description: '', img: './assets/img/theme/Screenshot.jpg' },
        { title: '', description: '', img: './assets/img/theme/Screenshot2.jpg' },
        { title: '', description: '', img: './assets/img/theme/Screenshot3.jpg' },
    ]


    seenImage = () => {
        this.clickSeenImage = 1;
        var image = <HTMLElement>document.getElementById('myImg')
        image.click();
    }

    debug = (id, index) => {
        this.clickSeenImageUser = index
    }

    clickProfileUser = (id) => {
        if (!this.authenticationService.IsLogin) {
            this.LoginRequired();
            return;
        }
        this.router.navigate(['/profile', id]);
    }

    updateStateImage = () => {
        var imageCurrent = <HTMLElement>document.getElementById(`clickFavoriteImage`).children[1]
        var stateImageCurrent = <HTMLElement>document.getElementById(`img_${imageCurrent.id.split("_")[1]}`).children[Number(imageCurrent.id.split("_")[0])]

        var liked = stateImageCurrent.id.split("_")[2]
        if (liked === "true") {
            this.usersService.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].liked = true;
            this.imageService.likeImage(this.authenticationService.UserInfo.Id, this.usersService.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].id)
                .then(data => {
                    console.log(data);

                })
                .catch(error => {
                    console.log('Khong like duoc hinh!');
                })


        } else {
            this.usersService.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].liked = false;
            this.imageService.likeImage(this.authenticationService.UserInfo.Id, this.usersService.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].id)
                .then(data => {
                    console.log(data);

                })
                .catch(error => {
                    console.log('Khong like duoc hinh!');
                })
        }
        //console.log(this.usersService.imageUsers[this.clickSeenImageUser].images)
    }

    isFilter = false;
    paging(index: number) {
        console.log('paging to page ' + index.toString());

        this.updatePagingNumber(index);

        this.authenticationService.UserInfo == null ? this.getFavoritors() : this.getSimilarUSer(this.isFilter);
    }
    previousPage() {
        if (this.usersService.FavoritePage.index == 1) {
            return
        }
        this.updatePagingNumber(this.usersService.FavoritePage.index - 1);
        this.authenticationService.UserInfo == null ? this.getFavoritors() : this.getSimilarUSer(this.isFilter);

    }
    nextPage() {
        if (this.usersService.FavoritePage.index == this.usersService.FavoritePage.total) {
            return;
        }
        this.updatePagingNumber(this.usersService.FavoritePage.index + 1);
        this.authenticationService.UserInfo == null ? this.getFavoritors() : this.getSimilarUSer(this.isFilter);

    }

    filterData = {
        name: "",
        location: ["Tất cả", "TP_HCM", "Hà_Nội"],
        gender: ["Nam", "Nữ"],
        fromAge: [],
        toAge: []
    }
    gender = "Tất cả";
    name = '';
    fromAge = 15;
    toAge = 60;
    location = "Tất cả";
    LoadFilterData() {
        for (let i = 16; i <= 60; i++) {
            this.filterData.fromAge.push(i);
            this.filterData.toAge.push(i);
        }

        this.usersService.GetProfileData()
            .then(response => {
                this.filterData.location = response.location;
                this.filterData.location.unshift("Tất cả");
                this.filterData.fromAge.unshift("15");
                this.filterData.toAge.unshift("60");
                this.filterData.gender.unshift("Tất cả");
            })
            .catch(error => { console.log(error) })
    }
    onSearch() {
        if (!this.authenticationService.IsLogin) {
            this.LoginRequired();
            return;
        }
        this.isFilter = true;
        this.getSimilarUSer(this.isFilter);
    }

    onActivate(event) {
        let scrollToTop = window.setInterval(() => {
            let pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 30); // how far to scroll on each step
            } else {
                window.clearInterval(scrollToTop);
            }
        }, 5);
    }


    onSelect(event) {

        this.files.push(...event.addedFiles);
    }

    onRemove(event) {

        this.files.splice(this.files.indexOf(event), 1);
    }

    NewImages:News[] = new Array();
    GetNewImages = (pageIndex:number, pageSize: number) =>{
        console.log(pageIndex)
        this.imageService.GetNewImages(pageIndex, pageSize)
            .then(response =>{
                this.NewImages = this.NewImages.concat(response);
            })
            .catch(err => console.log(err))
    }

    onLikeImage = (imageId, index) =>{
        this.NewImages[index].liked = ! this.NewImages[index].liked;
        this.imageService.likeImage(this.authenticationService.UserInfo.Id, imageId)
            .then(response =>{
                console.log(response)
            })
            .catch(err => console.log(err))
    }

    onFollowed = (userId, index) =>{
        this.NewImages[index].followed = ! this.NewImages[index].followed;
        this.usersService.Follow(userId)
            .then(response =>{
                console.log(response)
            })
            .catch(err => console.log(err))
    }

    onBlockUser(){
        if(this.blockUserId == this.authenticationService.UserInfo.Id){
            return;
        }
        this.usersService.BlockUser(this.blockUserId)
            .then(response=>{
                console.log(response)
            })
            .catch(err => console.log(err))
    }

    blockName;
    blockUserId;
    clickBlock = (userId, userName) =>{
        this.blockName = userName;
        this.blockUserId = userId;
        console.log(this.blockName + this.blockUserId)
    }

    ImageTitle = "";
    uploading = false;
    onUpload() {
        this.uploading = !this.uploading;
        this.imageService.addImages(this.authenticationService.UserInfo.Id, this.files, this.ImageTitle)
            .then(response => {
                this.alertService.clear();
                if(response.approved){
                    this.alertService.success(response.message, this.options);
                }
                else{
                    this.alertService.warn(response.message, this.options);
                }
                this.files = [];
                this.ngOnInit();
                this.uploading = !this.uploading;
            })
            .catch(error => {
                this.alertService.clear();
                this.alertService.error("Có lỗi khi upload ảnh!", this.options);
                this.uploading = !this.uploading;
            })
    }
}
