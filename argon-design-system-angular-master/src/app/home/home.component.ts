import { User } from './../Models/Models';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../service/users.service';
import { AlertService } from '../_alert';
import { AuthenticationService } from '../signup/authentication.service';

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
        private authenticationService: AuthenticationService
    ) { }

    options = {
        autoClose: false,
        keepAfterRouteChange: false
    };

    // Phân trang user
    PagingUsers: User[] = new Array();
    PageIndex = 1;
    PageSize = 10;

    //
    Loading = false;

    ngOnInit() {

        var GetUserInfo = localStorage.getItem('UserInfo');
        this.authenticationService.UserInfo = JSON.parse(GetUserInfo);

        this.Loading = true;
        this.usersService.GetPagingUsers(this.PageIndex, this.PageSize)
            .then(response => {
                this.Loading = false;
                this.PagingUsers = response;
                console.log(this.PagingUsers);
            })
            .catch(error => {
                this.Loading = false;
                this.alertService.clear();
                this.alertService.error("Lỗi server, vui lòng thử lại sau!", this.options);
            })
    }

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
    }
    GetUserInfo = (userId: string) => {
        this.alertService.clear();
        this.alertService.success('OK', this.options);
    }
    Favorite = (userId: string, event) => {
        
        if(!this.authenticationService.IsLogin){
            this.LoginRequired();
            return;
        }

        console.log(userId)
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
        console.log(checkClass)
        if (checkClass == 'carousel-control-next-icon') {
            this.nextCarousel()
        } else if (checkClass == 'carousel-control-prev-icon') {
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
}
