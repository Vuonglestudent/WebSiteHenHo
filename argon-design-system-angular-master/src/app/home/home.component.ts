import { ImageService } from './../service/image.service';
import { ImageUser, User } from '../models/models';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import {MessageService} from '../service/message.service';
import { Router } from '@angular/router';
import { UsersService } from '../service/users.service';
import { AlertService } from '../_alert';
import { AuthenticationService } from '../signup/authentication.service';
import { fadeInAnimation } from '../_animates/animates';
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

    options = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    // Phân trang user


    // Phân trang user
    PageIndexNewUser = 1;
    PageSizeNewUser = 10;

    // LoadImageUser
    

    //
    clickSeenImageUser
    Loading = false;
    clickSeenImage = 0;
    ngOnInit() {
        this.updatePagingNumber(this.usersService.FavoritePage.current);
        
        if (this.authenticationService.UserInfo != null) {
            if(this.usersService.Favoritors.length == 0 || !this.usersService.IsGetSimilarityUsers){
                this.getSimilarUSer(false);
                this.usersService.IsGetSimilarityUsers = true;
            }
        }
        else {
            this.getFavoritors();
        }

        if(this.usersService.NewUsers.length == 0){
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

    filter = {
        location: '',
        fromAge: 0,
        toAge: 0,
        gender: '',

    }
    getSimilarUSer = (filter:boolean) => {
        this.Loading = true;
        this.usersService.GetSimilarUSer(this.authenticationService.UserInfo.Id, this.usersService.FavoritePage.index, this.usersService.FavoritePage.size, filter, this.location, this.name, this.fromAge, this.toAge, this.gender)
            .then(response =>{
                this.Loading = false;
                this.usersService.Favoritors = response.data;
                this.usersService.FavoritePage.total = response.pageTotal;
                console.log(response)
                console.log(this.usersService.Favoritors)
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
        console.log('get page: ' + this.usersService.FavoritePage.index);
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

    getImagesOfUsers() {

    }

    updatePagingNumber(page: number) {

        console.log(this.usersService.FavoritePage.total)
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
        var firstCarousel = <HTMLInputElement>document.getElementById("carousel_0");
        var firstLiCarousel = <HTMLInputElement>document.getElementById("liCarousel_0");
        firstCarousel.setAttribute('class', 'carousel-item active');
        firstLiCarousel.setAttribute('class', 'active');
        const source = timer(1000, 2000);
        const subscribe = source.subscribe(val => {
            if (val % 2 == 0) {
                this.nextCarousel();
            }
        });

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
        if(this.likeProcessing == true){
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
        setTimeout(() => {
            this.router.navigateByUrl('/login');
        }, 3000);
    }

    count = 0;
    imageCarousel = [
        { title: '', description: '', img: './assets/img/theme/Screenshot.jpg' },
        { title: '', description: '', img: './assets/img/theme/Screenshot2.jpg' },
        { title: '', description: '', img: './assets/img/theme/Screenshot3.jpg' },
    ]

    changeCarousel = (event) => {
        var target = event.target;
        var checkClass = target.getAttribute('class');
        if (checkClass == 'carousel-control-next-icon' || checkClass == 'carousel-control-next') {
            this.nextCarousel()
        } else if (checkClass == 'carousel-control-prev-icon' || checkClass == 'carousel-control-prev') {
            this.prevCarousel()
        } else {
            this.changeByLi(event)
        }
    }

    nextCarousel = () => {
        var current = document.getElementsByClassName("carousel-item active")[0].getAttribute('id').split('_')[1];
        var currentLiCarousel = <HTMLInputElement>document.getElementById(`liCarousel_${current}`);
        currentLiCarousel.setAttribute('class', '');
        var currentCarousel = <HTMLInputElement>document.getElementById(`carousel_${current}`);
        currentCarousel.setAttribute('class', '');
        currentCarousel.setAttribute('hidden', 'true')
        var next: number = Number(current) + 1;
        if (next > (this.imageCarousel.length - 1)) {
            next = 0;
        }
        this.setCarousel(next);
    }

    prevCarousel = () => {
        var current = document.getElementsByClassName("carousel-item active")[0].getAttribute('id').split('_')[1];
        var currentLiCarousel = <HTMLInputElement>document.getElementById(`liCarousel_${current}`);
        currentLiCarousel.setAttribute('class', '');
        var currentCarousel = <HTMLInputElement>document.getElementById(`carousel_${current}`);
        currentCarousel.setAttribute('class', '');
        currentCarousel.setAttribute('hidden', 'true')
        var next: number = Number(current) - 1;
        if (next < 0) {
            next = this.imageCarousel.length - 1;
        }
        this.setCarousel(next);
    }

    changeByLi = (event) => {
        var current = document.getElementsByClassName("carousel-item active")[0].getAttribute('id').split('_')[1];
        var currentLiCarousel = <HTMLInputElement>document.getElementById(`liCarousel_${current}`);
        currentLiCarousel.setAttribute('class', '');
        var currentCarousel = <HTMLInputElement>document.getElementById(`carousel_${current}`);
        currentCarousel.setAttribute('class', '');
        currentCarousel.setAttribute('hidden', 'true')
        var target = event.target;
        var next = target.getAttribute('id').split('_')[1];
        this.setCarousel(Number(next));
    }

    setCarousel = (next: number) => {
        var liCarousel = <HTMLInputElement>document.getElementById(`liCarousel_${next}`);
        var carousel = <HTMLInputElement>document.getElementById(`carousel_${next}`);
        var imgCarousel = <HTMLInputElement>document.getElementById(`carouselExampleCaptions`)
        liCarousel.setAttribute('class', 'active');
        carousel.setAttribute('class', 'carousel-item active')
        carousel.removeAttribute('hidden');
        imgCarousel.setAttribute('style', `background-image: url('${this.imageCarousel[next].img}')`)
    }

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
    LoadFilterData(){
        for (let i = 16; i <= 60; i++) {
            this.filterData.fromAge.push(i); 
            this.filterData.toAge.push(i);            
        }
        
        this.usersService.GetProfileData()
        .then(response =>{
            this.filterData.location = response.location;
            this.filterData.location.unshift("Tất cả");
            this.filterData.fromAge.unshift("15");
            this.filterData.toAge.unshift("60");
            this.filterData.gender.unshift("Tất cả");
        })
        .catch(error => {console.log(error)})
    }
    onSearch(){
        if(!this.authenticationService.IsLogin){
            this.LoginRequired();
            return;
        }
        this.isFilter = true;
        this.getSimilarUSer(this.isFilter);
    }

    onScrollUp(){

        // var el = document.querySelector('container');
        // el.scrollTop = el.scrollHeight;
        
        // setTimeout(function(){
        //   el.scrollTop = 0;
        // }, 500);

        window.scrollTo(0, 0);

        // element.setAttribute("body.scrollTop", "0");
        // element.setAttribute("documentElement.scrollTop", "0");
        // document.body.scrollTop = 0;
        // document.documentElement.scrollTop = 0;
    }
}
