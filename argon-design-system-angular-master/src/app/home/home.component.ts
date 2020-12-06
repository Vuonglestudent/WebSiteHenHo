import { async } from '@angular/core/testing';
import { ImageService } from './../service/image.service';
import { ImageUser, User } from './../Models/Models';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../service/users.service';
import { AlertService } from '../_alert';
import { AuthenticationService } from '../signup/authentication.service';
import { MessageService } from '../service/message.service';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private http: HttpClient,
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
    Favoritors: User[] = new Array();
    FavoritePage: any = {
        index: 1,
        size: 12,
        total: 0,
        current: 1,
        position: 1
    };

    // Phân trang user
    NewUsers: User[] = new Array();
    PageIndexNewUser = 1;
    PageSizeNewUser = 10;

    // LoadImageUser
    imageUsers: ImageUser[] = new Array();

    //
    clickSeenImageUser
    Loading = false;
    clickSeenImage = 0;
    ngOnInit() {
        this.updatePagingNumber(1);
        
        if (this.authenticationService.UserInfo != null) {
            console.log('similar')
            this.getSimilarUSer();
        }
        else {
            this.getFavoritors();
        }

        this.usersService.GetNewUsers(this.PageIndexNewUser, this.PageSizeNewUser)
            .then(response => {
                this.NewUsers = response;
            })
            .catch(error => {
                this.alertService.clear();
                this.alertService.error("Lỗi server!", this.options);
            })
    }

    filter = {
        location: '',
        fromAge: 0,
        toAge: 0,
        gender: '',

    }
    getSimilarUSer = () => {
        this.Loading = true;
        this.usersService.GetSimilarUSer(this.authenticationService.UserInfo.Id, this.FavoritePage.index, this.FavoritePage.size, this.filter.location, this.filter.fromAge, this.filter.toAge, this.filter.gender)
            .then(response =>{
                this.Loading = false;
                this.Favoritors = response.data;
                this.FavoritePage.total = response.pageTotal;
                console.log(response)
                console.log(this.Favoritors)
                this.Favoritors.forEach(element => {
                    this.imageService.getImageByUserId(element.id)
                        .then(data => {
                            const imageUser = {} as ImageUser
                            imageUser.id = element.id;
                            imageUser.images = data;
                            this.imageUsers.push(imageUser)
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
        console.log('get page: ' + this.FavoritePage.index);
        this.usersService.GetFavoritest(this.FavoritePage.index, this.FavoritePage.size)
            .then(response => {
                this.Loading = false;
                this.Favoritors = response.data;
                this.FavoritePage.total = response.pageTotal;

                this.Favoritors.forEach(element => {
                    this.imageService.getImageByUserId(element.id)
                        .then(data => {
                            const imageUser = {} as ImageUser
                            imageUser.id = element.id;
                            imageUser.images = data;
                            this.imageUsers.push(imageUser)
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

        console.log(this.FavoritePage.total)
        this.FavoritePage.index = page;
        if (page == 1) {
            this.FavoritePage.position = 1;
            this.FavoritePage.current = 2;
        }
        else if (page == this.FavoritePage.total) {
            this.FavoritePage.position = 3;
            this.FavoritePage.current = page - 1;
        }
        else {
            this.FavoritePage.position = 2;
            this.FavoritePage.current = page;
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
    Favorite = (userId: string, event) => {

        if (!this.authenticationService.IsLogin) {
            this.LoginRequired();
            return;
        }

        var target = event.target;
        var favouritesCurrent = Number(target.innerText)
        this.usersService.Favorite(userId)
            .then(response => {
                this.alertService.clear();
                this.alertService.success(response.message, this.options);
                if (response.message == 'Favorited') {
                    target.className = 'ni ni-favourite-28 text-danger'
                    target.innerHTML = `<span><small class="text-dark" style="font-size: 60%;">${favouritesCurrent + 1}</small></span>`
                } else {
                    target.className = 'ni ni-favourite-28'
                    target.innerHTML = `<span><small class="text-dark" style="font-size: 60%;">${favouritesCurrent - 1}</small></span>`
                }
            })
            .catch(error => {
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
        { title: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-1-800x800.jpg' },
        { title: 'Second slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-2-800x800.jpg' },
        { title: 'Third slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-3-800x800.jpg' },
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
            this.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].liked = true;
            this.imageService.likeImage(this.authenticationService.UserInfo.Id, this.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].id)
                .then(data => {
                    console.log(data);

                })
                .catch(error => {
                    console.log('Khong like duoc hinh!');
                })


        } else {
            this.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].liked = false;
            this.imageService.likeImage(this.authenticationService.UserInfo.Id, this.imageUsers[this.clickSeenImageUser].images[Number(imageCurrent.id.split("_")[0]) - 1].id)
                .then(data => {
                    console.log(data);

                })
                .catch(error => {
                    console.log('Khong like duoc hinh!');
                })
        }
        //console.log(this.imageUsers[this.clickSeenImageUser].images)
    }

    paging(index: number) {
        console.log('paging to page ' + index.toString());

        this.updatePagingNumber(index);

        this.authenticationService.UserInfo == null ? this.getFavoritors() : this.getSimilarUSer();
    }
    previousPage() {
        if (this.FavoritePage.index == 1) {
            return
        }
        this.updatePagingNumber(this.FavoritePage.index - 1);
        this.authenticationService.UserInfo == null ? this.getFavoritors() : this.getSimilarUSer();

    }
    nextPage() {
        if (this.FavoritePage.index == this.FavoritePage.total) {
            return;
        }
        this.updatePagingNumber(this.FavoritePage.index + 1);
        this.authenticationService.UserInfo == null ? this.getFavoritors() : this.getSimilarUSer();

    }
}
