import { ImageService } from './../../service/image.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../signup/authentication.service';
import { User, ImageUser, ProfileData } from '../../models/models';
import { UsersService } from './../../service/users.service';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../_animates/animates';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-friends',
  templateUrl: './filter-friends.component.html',
  styleUrls: ['./filter-friends.component.scss'],
  animations: [slideInOutAnimation],

  // attach the slide in/out animation to the host (root) element of this component
  host: { '[@slideInOutAnimation]': '' },
})
export class FilterFriendsComponent implements OnInit {

  filterSet = [
    { feature: "ageGroup", title: "Độ tuổi", value: [] },
    { feature: "body", title: "Dáng người", value: [] },
    { feature: "gender", title: "Giới tính", value: [] },
    { feature: "education", title: "Học vấn", value: [] },
    { feature: "religion", title: "Tôn giáo", value: [] },
    { feature: "cook", title: "Nấu ăn", value: [] },
    { feature: "likeTechnology", title: "Công nghệ", value: [] },
    { feature: "likePet", title: "Thú cưng", value: [] },
    { feature: "playSport", title: "Thể thao", value: [] },
    { feature: "travel", title: "Du lịch", value: [] },
    { feature: "game", title: "Chơi game", value: [] },
    { feature: "shopping", title: "Mua sắm", value: [] },
    { feature: "location", title: "Địa chỉ", value: [] },
    { feature: "character", title: "Tính cách", value: [] },

    { feature: "favoriteMovie", title: "Thể loại phim", value: [] },
    { feature: "atmosphereLike", title: "Không khí", value: [] },
    { feature: "drinkBeer", title: "Uống bia", value: [] },
    { feature: "smoking", title: "Hút thuốc", value: [] },
    { feature: "marriage", title: "Hôn nhân", value: [] },
    { feature: "job", title: "Công việc", value: [] },
  ]

  extend = false;
  faSpinner = faSpinner;
  constructor(
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private imageService: ImageService
  ) { }

  items = [];

  Loading = false;
  heightBody: number;
  Users: User[] = new Array();
  UserPage: any = {
    index: 1,
    size: 15,
    total: 0,
    current: 1,
    position: 1
  };

  imageUsers: ImageUser[] = new Array();
  ngOnInit(): void {
    this.updatePagingNumber(1);
    this.getUsers();
    this.usersService.GetProfileData()
      .then(data => {
        console.log(data)
        this.mappingProfileData(data)
        setTimeout(() => this.changeHeight(), 10)
      })
      .catch(error => console.log(error))
  }

  private mappingProfileData(data: ProfileData) {

    this.filterSet[0].value = data.ageGroup;
    // this.filterSet[1].value = data.body;
    // this.filterSet[2].value = data.gender;
    // this.filterSet[3].value = data.education;
    // this.filterSet[4].value = data.religion;
    // this.filterSet[5].value = data.cook;
    // this.filterSet[6].value = data.likeTechnology;
    // this.filterSet[7].value = data.likePet;
    // this.filterSet[8].value = data.playSport;
    // this.filterSet[9].value = data.travel;
    // this.filterSet[10].value = data.game;
    // this.filterSet[11].value = data.shopping;
    this.filterSet[12].value = data.location;
    // this.filterSet[13].value = data.character;

    // this.filterSet[14].value = data.favoriteMovie;
    // this.filterSet[15].value = data.atmosphereLike;
    // this.filterSet[16].value = data.drinkBeer;
    // this.filterSet[17].value = data.smoking;
    // this.filterSet[18].value = data.marriage;
    this.filterSet[19].value = data.job;

  }

  ngAfterViewInit(): void {
    var tagInputRemove = <HTMLElement>document.getElementsByTagName('tag-input-form')[0]
    tagInputRemove.setAttribute('hidden', 'true');
    tagInputRemove.setAttribute('disable', 'true');
  }

  setStatusValue = (e, feature, title, value) => {
    var target = e.target
    if (target.className != 'btn fa active-btn') {
      target.className = 'btn fa active-btn';
      var newHashTag = {
        feature: feature,
        display: value,
        title: title,
        // readonly: true
      }
      this.items.push(newHashTag)
    } else {
      target.className = 'btn fa';
      this.items.forEach((element, index) => {
        if (element.title == title && element.display == value) {
          this.items.splice(index, 1)
        }
      });
    }
    console.log(this.items)
    setTimeout(() => this.changeHeight(), 10)
  }

  deleteHashTag = (e) => {
    var itemRemove = <HTMLElement>document.getElementById(`${e.title}_${e.display}`)
    itemRemove.className = 'btn fa';
    setTimeout(() => this.changeHeight(), 10)
  }

  changeHeight = () => {
    var heightFilter = <HTMLElement>document.getElementsByClassName('col-8 col-xl-8 col-md-8 filterblock')[0]
    //console.log(heightFilter.clientHeight)
    this.heightBody = 250 + heightFilter.clientHeight - 100;
    var heightContentUsers = <HTMLElement>document.getElementById('contentUsers');
    //console.log(this.heightBody)
    heightContentUsers.style.top = String(`${this.heightBody}px`)
    //console.log(heightContentUsers.style.top)
  }
  changeExtend = () => {
    this.extend = !this.extend
    setTimeout(() => this.changeHeight(), 10)
  }

  getUsers() {
    this.Loading = true;
    this.usersService.FilterFeatures(this.items, this.UserPage.index, this.UserPage.size)
      .then(response => {
        this.Loading = false;
        this.Users = response.data;
        this.UserPage.total = response.pageTotal;

        this.Users.forEach(element => {
          this.imageService.getImageByUserId(element.id)
            .then(data => {
              const imageUser = {} as ImageUser
              imageUser.id = element.id;
              imageUser.images = data;
              this.imageUsers.push(imageUser)
            })
            .catch(error => {
              // this.alertService.clear();
              // this.alertService.error("Có lỗi khi tải hình ảnh!");
            })
        });
      })
      .catch(error => {
        //this.Loading = false;
        // this.alertService.clear();
        // this.alertService.error("Lỗi server, vui lòng thử lại sau!", this.options);
      })

  }
  updatePagingNumber(page: number) {

    //console.log(this.UserPage.total)
    this.UserPage.index = page;
    if (page == 1) {
      this.UserPage.position = 1;
      this.UserPage.current = 2;
    }
    else if (page == this.UserPage.total) {
      this.UserPage.position = 3;
      this.UserPage.current = page - 1;
    }
    else {
      this.UserPage.position = 2;
      this.UserPage.current = page;
    }
  };

  paging(index: number) {
    //console.log('paging to page ' + index.toString());

    this.updatePagingNumber(index);
    this.getUsers();
  }
  previousPage() {
    if (this.UserPage.index == 1) {
      return
    }
    this.updatePagingNumber(this.UserPage.index - 1);
    this.getUsers();
  }
  nextPage() {
    if (this.UserPage.index == this.UserPage.total) {
      return;
    }
    this.updatePagingNumber(this.UserPage.index + 1);
    this.getUsers();
  }

  clickProfileUser = (id) => {
    if (!this.authenticationService.IsLogin) {
      //this.LoginRequired();
      return;
    }
    this.router.navigate(['/profile', id]);
  }

  Favorite = (userId: string, event) => {

    if (!this.authenticationService.IsLogin) {
      //this.LoginRequired();
      return;
    }

    var target = event.target;
    var favouritesCurrent = Number(target.innerText)
    this.usersService.Favorite(userId)
      .then(response => {
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
        if (error.status == 401) {
          // this.LoginRequired();
          return;
        }
        // this.alertService.clear();
        // this.alertService.error(error.error.message, this.options);
      })
  }

  onFilter() {
    this.updatePagingNumber(1);
    this.Loading = true;
    this.usersService.FilterFeatures(this.items, this.UserPage.index, this.UserPage.size)
      .then(response => {
        this.Users = response.data;
        this.UserPage.total = response.pageTotal;

        this.Loading = false;
      })
      .catch(error => console.log(error))
  }
}
