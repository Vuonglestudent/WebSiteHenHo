import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../service/users.service';
import { User, ProfileData } from '../Models/Models';
import { AuthenticationService } from '../signup/authentication.service';
import { NgForm } from '@angular/forms';

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
    imgArray = 10
    friends = 22
    btnEdit = 1
    imageCarousel = [
        { title: 'First slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-1-800x800.jpg' },
        { title: 'Second slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-2-800x800.jpg' },
        { title: 'Third slide label', description: 'Nulla vitae elit libero, a pharetra augue mollis interdum.', img: './assets/img/theme/team-3-800x800.jpg' },
    ]

    profileData: ProfileData = new ProfileData();
    public UserProfile: User = new User();

    constructor(
        private usersService: UsersService,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.usersService.GetById(this.authenticationService.UserInfo.Id)
            .then(data => {
                this.UserProfile = data;
                this.UserProfile.profile.dob = (this.UserProfile.profile.dob).split('T')[0]
                console.log(this.UserProfile , this.UserProfile.profile.dob);
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
    }

    onUpdateInfo(){
        // console.log(f.value);
        console.log(this.UserProfile.profile)
    }

    checkFavourite = (e) => {
        var target = e.target;
        console.log(target)
        if (target.className == 'ni ni-favourite-28') {
            target.setAttribute('class', 'ni ni-favourite-28 text-danger')
            this.UserProfile.numberOfFavoriting = this.UserProfile.numberOfFavoriting + 1;
        } else {
            target.setAttribute('class', 'ni ni-favourite-28')
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

    replaceCharacter = (userProfile: User) => {
        userProfile.profile.findPeople = userProfile.profile.findPeople.replace(/_/g, " ");
        userProfile.profile.iAm = userProfile.profile.iAm.replace(/_/g, " ");
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
        userProfile.profile.drinkBeer = userProfile.profile.drinkBeer.replace(/_/g, " ");
    };

    updateFeature = (feature: string) => {
        return feature.replace(/ /g, "_");
    }

    clickEdit = () => {
        this.btnEdit = 0;
    }

    arrayNumbers(n: number, startFrom: number): number[] {
        return [...Array(n).keys()].map(i => i + startFrom);
    }

    files: File[] = [];
    uploadImage:boolean = false;

    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
    }

    onRemove(event) {
        console.log(event);
        this.files.splice(this.files.indexOf(event), 1);
    }

    uploadImages(){
        this.uploadImage = !this.uploadImage;
    }


}
