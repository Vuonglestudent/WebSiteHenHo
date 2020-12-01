import { ImageService } from './../service/image.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../signup/authentication.service';
import { User, ImageUser } from './../Models/Models';
import { UsersService } from './../service/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-friends',
  templateUrl: './filter-friends.component.html',
  styleUrls: ['./filter-friends.component.scss']
})
export class FilterFriendsComponent implements OnInit {

  fiiterGender = [
    { title: 'Giới tính', value: ['Nam', 'Nữ'] },
    { title: 'Cân nặng', value: ['Nhẹ', 'Trung Bình', 'Nặng'] },
    { title: 'Chiều cao', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '4', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '5', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '6', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '7', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '8', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '9', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '10', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '11', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '12', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '13', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
    { title: '14', value: ['Nhỏ nhắn', 'Trung Bình', 'Cao'] },
  ]

  extend = false;
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
  }

  ngAfterViewInit(): void {
    var tagInputRemove = <HTMLElement>document.getElementsByTagName('tag-input-form')[0]
    tagInputRemove.setAttribute('hidden', 'true');
    tagInputRemove.setAttribute('disable', 'true');
  }

  setStatusValue = (e, title, value) => {
    var target = e.target
    if (target.className != 'btn fa active-btn') {
      target.className = 'btn fa active-btn';
      var newHashTag = {
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
    setTimeout(() => this.changeHeight(), 10)
  }

  deleteHashTag = (e) => {
    var itemRemove = <HTMLElement>document.getElementById(`${e.title}_${e.display}`)
    itemRemove.className = 'btn fa';
    setTimeout(() => this.changeHeight(), 10)
  }

  changeHeight = () => {
    var heightFilter = <HTMLElement>document.getElementsByClassName('col-8 col-xl-8 col-md-8 filterblock')[0]
    console.log(heightFilter.clientHeight)
    this.heightBody = 250 + heightFilter.clientHeight - 100;
    var heightContentUsers = <HTMLElement>document.getElementById('contentUsers');
    console.log(this.heightBody)
    heightContentUsers.style.top = String(`${this.heightBody}px`)
    console.log(heightContentUsers.style.top)
  }
  changeExtend = () => {
    this.extend = !this.extend
    setTimeout(() => this.changeHeight(), 10)
  }

  getUsers() {
    this.Loading = true;
    console.log('get page: ' + this.UserPage.index);
    this.usersService.GetFavoritest(this.UserPage.index, this.UserPage.size)
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

    console.log(this.UserPage.total)
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
    console.log('paging to page ' + index.toString());

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
}
