import { User } from './../Models/Models';
import { UsersService } from './../service/users.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager-user',
  templateUrl: './manager-user.component.html',
  styleUrls: ['./manager-user.component.css']
})
export class ManagerUserComponent implements OnInit {

  constructor(
    private usersService: UsersService
  ) { }

  Loading = false;

  Favoritors: User[] = new Array();
  FavoritePage: any = {
    index: 1,
    size: 6,
    total: 0,
    current: 1,
    position: 1
  };

  //fillter
  fillterName = true;
  fillterFollower = true;
  fillterFavorite = true;
  fillterImage = true;


  ngOnInit(): void {
    this.updatePagingNumber(1);
    this.getFavoritors();
  }

  setActiveUser = (e) => {
    var target = e.target;
    console.log(target.className)
    if (target.className === "media-body btn-flip") {
      target.className = "media-body btn-flip active-btn-flip"
    } else {
      target.className = "media-body btn-flip"
    }
  }

  getFavoritors() {
    this.Loading = true;
    console.log('get page: ' + this.FavoritePage.index);
    this.usersService.GetFavoritest(this.FavoritePage.index, this.FavoritePage.size)
      .then(response => {
        this.Loading = false;
        this.Favoritors = response.data;
        this.FavoritePage.total = response.pageTotal;

        // this.Favoritors.forEach(element => {
        //   this.imageService.getImageByUserId(element.id)
        //     .then(data => {
        //       const imageUser = {} as ImageUser
        //       imageUser.id = element.id;
        //       imageUser.images = data;
        //       this.imageUsers.push(imageUser)
        //     })
        //     .catch(error => {
        //       this.alertService.clear();
        //       this.alertService.error("Có lỗi khi tải hình ảnh!");
        //     })
        // });
      })
      .catch(error => {
        //this.Loading = false;
        // this.alertService.clear();
        // this.alertService.error("Lỗi server, vui lòng thử lại sau!", this.options);
      })

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

  paging(index: number) {
    console.log('paging to page ' + index.toString());

    this.updatePagingNumber(index);
    this.getFavoritors();
  }
  previousPage() {
    if (this.FavoritePage.index == 1) {
      return
    }
    this.updatePagingNumber(this.FavoritePage.index - 1);
    this.getFavoritors();
  }
  nextPage() {
    if (this.FavoritePage.index == this.FavoritePage.total) {
      return;
    }
    this.updatePagingNumber(this.FavoritePage.index + 1);
    this.getFavoritors();
  }

  clickFillterName = () => {
    this.fillterName = !this.fillterName
  }
  clickFillterFollow = () => {
    this.fillterFollower = !this.fillterFollower
  }

  clickFillterFavorite = () => {
    this.fillterFavorite = !this.fillterFavorite
  }

  clickFillterImage = () => {
    this.fillterImage = !this.fillterImage
  }
}
