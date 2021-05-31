import { SignalRService } from 'src/app/shared/service/signal-r.service';
import { ImageService } from '../../shared/service/image.service';
import { ImageUser, User, News, IUserInfo, IUser, Image } from '../../models/models';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../shared/service/users.service';
import { AlertService } from '../../shared/_alert';
import { AuthenticationService } from '../../shared/service/authentication.service';
import { fadeInAnimation } from '../../shared/_animates/animates';
import { faSpinner, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    animations: [fadeInAnimation],

    // attach the fade in animation to the host (root) element of this component
    host: { '[@fadeInAnimation]': '' },
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    pageIndex = 1;
    @HostListener('window:scroll', ['$event']) onScrollEvent($event: any) {

        var element = document.getElementById('fixed-content-id');
        var space = document.getElementById('right-space');
        if (element) {
            if (window.pageYOffset > 1000) {
                element.classList.add('fixed-content');
                space.classList.remove('hide-right-space');
            }
            else {
                element.classList.remove('fixed-content');
                space.classList.add('hide-right-space');
            }


            if (window.pageYOffset > (1400 * this.pageIndex)) {
                if (!this.isViewImage) {
                    this.nextPage();
                }
            }
        }
    }
    numbers = Array(100).fill(0);
    userInfo: IUserInfo;
    isViewFriend = false;
    onlineCount: number = 0;
    constructor(
        private router: Router,
        public usersService: UsersService,
        private alertService: AlertService,
        private authenticationService: AuthenticationService,
        private imageService: ImageService,
        private signalRService: SignalRService
    ) {
        this.authenticationService.userInfoObservable
            .subscribe(user => {
                this.userInfo = user;
                if (this.userInfo != undefined) {
                    this.isViewFriend = true;
                }
                else {
                    this.isViewFriend = false;
                    this.onActivate();
                }
            })

        this.signalRService.onlineCountObservable
            .subscribe(onlineCount => this.onlineCount = onlineCount)
    }

    faSpinner = faSpinner;
    faSyncAlt = faSyncAlt;


    options = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    options2 = {
        autoClose: true,
        keepAfterRouteChange: false
    };


    files: File[] = [];

    // Phân trang user
    PageIndexNewUser = 1;
    PageSizeNewUser = 10;

    // LoadImageUser

    PageIndexImage = 1;
    PageSizeImage = 5;
    //
    Loading = false;
    clickSeenImage = 0;
    ngOnInit() {
        //this.updatePagingNumber(this.usersService.FavoritePage.index);

        if (this.userInfo != null) {
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

    }

    reload() {
        this.isFilter = false;
        this.noMore = false;
        this.noMoreImage = false;
        this.usersService.Favoritors = new Array();
        this.usersService.FavoritePage.index = 1;
        this.pageIndex = 1;

        if (this.userInfo != null) {
            this.getSimilarUSer(false);
            this.usersService.IsGetSimilarityUsers = true;
        }
        else {
            this.getFavoritors();
        }
    }

    loadNewImages(){
        if (this.userInfo != null) {
            this.isViewImage = true;
            this.GetNewImages(this.PageIndexImage, this.PageSizeImage);
        }
    }


    onSeeMoreImage = () => {
        this.PageIndexImage += 1;
        this.GetNewImages(this.PageIndexImage, this.PageSizeImage);
    }

    filter = {
        location: '',
        fromAge: 0,
        toAge: 0,
        gender: '',

    }

    noMore = false;
    getSimilarUSer = (filter: boolean) => {
        this.Loading = true;
        this.usersService.GetSimilarUSer(this.userInfo.id, this.usersService.FavoritePage.index, this.usersService.FavoritePage.size, filter, this.location, this.name, this.fromAge, this.toAge, this.gender)
            .then(response => {
                this.Loading = false;
                this.usersService.Favoritors = this.usersService.Favoritors.concat(response.data);
                this.usersService.FavoritePage.total = response.pageTotal;

                if (response.data.length === 0) {
                    this.noMore = true;
                    this.alertService.warn("Bạn đã đến trang cuối...", this.options2);
                    return;
                }
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
                            this.usersService.Favoritors.filter(x => x.id == element.id)[0].images = data;
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

        if (this.userInfo != null) {
            if (!this.userInfo.isInfoUpdated) {
                this.router.navigate(['/profile', this.userInfo.id]);
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

        if (!this.userInfo == undefined) {
            this.LoginRequired();
            return;
        }
        if (this.likeProcessing == true) {
            return;
        }
        this.likeProcessing = true;

        var target = event.target;
        var numberFavorite = <HTMLElement>document.getElementById(`numberFavorites_${userId}`).children[0];
        this.usersService.Favorite(userId)
            .then(response => {
                this.likeProcessing = false;
                // this.alertService.clear();
                // this.alertService.success(response.message, this.options);
                if (response.message == 'Favorited') {
                    target.className = 'ni ni-favourite-28 text-danger'
                    numberFavorite.innerText = (Number(numberFavorite.innerText) + 1).toString();
                } else {
                    target.className = 'ni ni-favourite-28'
                    numberFavorite.innerText = (Number(numberFavorite.innerText) - 1).toString();
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

    images: Image[] = new Array();



    slideIndex = 1;



    showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("demo");
        var captionText = document.getElementById("caption");

        if (n > slides.length) { this.slideIndex = 1 }

        if (n < 1) { this.slideIndex = slides.length }

        for (i = 0; i < slides.length; i++) {
            slides[i].setAttribute("style", "display: none");
        }

        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        console.log('slides');
        console.log(slides);
        console.log('dots');
        console.log(dots);
        console.log('slideIndex');
        console.log(this.slideIndex);

        console.log(slides[0]);

        slides[this.slideIndex - 1].setAttribute("style", "display:block");
        dots[this.slideIndex - 1].className += " active";
        captionText.innerHTML = dots[this.slideIndex - 1].getAttribute("alt");
    }

    onViewImage = (user: User) => {
        this.images = [];
        this.imageService.getImageByUserId(user.id)
            .then(data => {
                //this.usersService.Favoritors.filter(x => x.id == user.id)[0].images = data;
                this.images = data;
                this.openModal();
                setTimeout(() => {
                    this.showSlides(1);
                }, 5);
            })
            .catch(error => {
                this.alertService.clear();
                this.alertService.error("Có lỗi khi tải hình ảnh!");
            })

        console.log(user);

    }
    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    currentSlide(n) {
        this.showSlides(this.slideIndex = n);
    }

    clickProfileUser = (id) => {
        if (this.userInfo == undefined) {
            this.LoginRequired();
            return;
        }
        this.router.navigate(['/profile', id]);
    }
    isShowImage = true;
    openModal() {
        document.getElementById("myModal").style.display = "block";
        this.isShowImage = false;
    }

    closeModal() {
        document.getElementById("myModal").style.display = "none";
        this.isShowImage = true;
    }


    isFilter = false;
    paging(index: number) {
        console.log('paging to page ' + index.toString());

        this.updatePagingNumber(index);

        this.userInfo == undefined ? this.getFavoritors() : this.getSimilarUSer(this.isFilter);
    }
    previousPage() {
        if (this.usersService.FavoritePage.index == 1) {
            return
        }
        this.updatePagingNumber(this.usersService.FavoritePage.index - 1);
        this.userInfo == undefined ? this.getFavoritors() : this.getSimilarUSer(this.isFilter);

    }
    nextPage() {
        console.log('next page')
        // if (this.usersService.FavoritePage.index == this.usersService.FavoritePage.total) {
        //     console.log('return')
        //     return;
        // }

        this.updatePagingNumber(this.usersService.FavoritePage.index + 1);
        this.userInfo == undefined ? this.getFavoritors() : this.getSimilarUSer(this.isFilter);
        this.pageIndex += 1;
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
        if (this.userInfo == undefined) {
            this.LoginRequired();
            return;
        }

        if (!this.isFilter) {
            this.usersService.Favoritors = new Array();
            this.usersService.FavoritePage.index = 1;
            this.pageIndex = 1;
        }

        this.isFilter = true;
        this.pageIndex = 1;
        this.getSimilarUSer(this.isFilter);
    }

    onActivate() {
        let scrollToTop = window.setInterval(() => {
            let pos = window.pageYOffset;
            if (pos > 0) {
                window.scrollTo(0, pos - 50);
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

    NewImages: News[] = new Array();
    noMoreImage = false;
    GetNewImages = (pageIndex: number, pageSize: number) => {
        if(this.noMoreImage){
            return;
        }

        this.Loading = true;
        this.imageService.GetNewImages(pageIndex, pageSize)
            .then(response => {
                this.Loading = false;

                if (response.length == 0) {
                    this.noMoreImage = true;
                    this.alertService.warn("Bạn đã đến trang cuối...", this.options2);
                }
                this.NewImages = this.NewImages.concat(response);
            })
            .catch(err => {
                this.Loading = false;
                console.log(err);
            })
    }

    onLikeImage = (imageId, index) => {
        this.NewImages[index].liked = !this.NewImages[index].liked;
        this.imageService.likeImage(this.userInfo.id, imageId)
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
    }

    onFollowed = (userId, index) => {
        this.NewImages[index].followed = !this.NewImages[index].followed;
        this.usersService.Follow(userId)
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
    }

    onBlockUser() {
        if (this.blockUserId == this.userInfo.id) {
            return;
        }
        this.usersService.BlockUser(this.blockUserId)
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
    }

    blockName;
    blockUserId;
    clickBlock = (userId, userName) => {
        this.blockName = userName;
        this.blockUserId = userId;
        console.log(this.blockName + this.blockUserId)
    }

    isViewImage = false;

    ImageTitle = "";
    uploading = false;
    onUpload() {
        this.uploading = !this.uploading;
        this.imageService.addImages(this.userInfo.id, this.files, this.ImageTitle)
            .then(response => {
                this.alertService.clear();
                if (response.approved) {
                    this.alertService.success(response.message, this.options);
                }
                else {
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
