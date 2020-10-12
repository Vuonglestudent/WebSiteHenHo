import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        private http: HttpClient,
    ) { }
    // model = {
    //     left: true,
    //     middle: false,
    //     right: false
    // };

    // focus;
    // focus1;

    count = 0;
    imageCarousel = [
        { title: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-1-800x800.jpg' },
        { title: 'Second slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-2-800x800.jpg' },
        { title: 'Third slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-3-800x800.jpg' },
    ]


    ngAfterViewInit(): void {
        var firstCarousel = <HTMLInputElement> document.getElementById("carousel_0");
        var firstLiCarousel = <HTMLInputElement> document.getElementById("liCarousel_0");
        firstCarousel.setAttribute('class', 'carousel-item active');
        firstLiCarousel.setAttribute('class', 'active');
        const source = timer(1000, 2000);
        const subscribe = source.subscribe(val => {
            if (val%2 == 0){
                this.nextCarousel();
            }
        });
    }
    
    ngOnInit() {}

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
