import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

    nameUser = 'Lê Quốc Nguyên Vương'
    ageUser = '20'
    addressUser = 'Đường số 8, Linh Trung, Thủ đức'
    imgAvatar = "./assets/img/theme/team-3-800x800.jpg"
    favourites = 12
    imgArray = 10
    friends = 22
    
    constructor() { }

    ngOnInit() {}

    checkFavourite = (e) => {
        var target = e.target;
        if (target.className == 'ni ni-favourite-28') {
            target.setAttribute('class' , 'ni ni-favourite-28 text-danger')
            this.favourites = this.favourites + 1;
        } else {
            target.setAttribute('class' , 'ni ni-favourite-28')
            this.favourites = this.favourites - 1;
        }
    }

    clickFollow = (e) => {
        var target = e.target;
        if (target.innerHTML == 'Theo dõi'){
            target.className = 'btn btn-sm btn-danger mr-4';
            target.innerHTML = 'Hủy theo dõi';
            this.friends = this.friends + 1;
        } else {
            target.className = 'btn btn-sm btn-info mr-4'
            target.innerHTML = 'Theo dõi'
            this.friends = this.friends - 1;
        }
    }
}
