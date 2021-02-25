import { User } from '../../models/models';
import { UsersService } from '../../service/users.service';
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

  Users: User[] = new Array();
  PagingInfo: any = {
    index: 1,
    size: 6,
    total: 0,
    current: 1,
    position: 1
  };
  Feature = "FullName";
  IsAscending = true;

  //filter
  filterName = true;
  filterFollower = true;
  filterFavorite = true;
  filterImage = true;
  filterStatus = true;

  ngOnInit(): void {
    this.updatePagingNumber(1);
    this.getFavoritors();
  }

  setActiveUser = (e, userId) => {
    var target = e.target;
    console.log(target.className)
    if (target.className === "media-body btn-flip") {
      target.className = "media-body btn-flip active-btn-flip";
      
    } else {
      target.className = "media-body btn-flip";
    }

    this.usersService.DisableUser(userId)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  }

  getFavoritors() {
    this.Loading = true;
    console.log('get page: ' + this.PagingInfo.index);
    this.usersService.FilterUsers(this.Feature, this.IsAscending, this.PagingInfo.index, this.PagingInfo.size)
      .then(response => {
        this.Loading = false;
        this.Users = response.data;
        this.PagingInfo.total = response.pageTotal;

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

    console.log(this.PagingInfo.total)
    this.PagingInfo.index = page;
    if (page == 1) {
      this.PagingInfo.position = 1;
      this.PagingInfo.current = 2;
    }
    else if (page == this.PagingInfo.total) {
      this.PagingInfo.position = 3;
      this.PagingInfo.current = page - 1;
    }
    else {
      this.PagingInfo.position = 2;
      this.PagingInfo.current = page;
    }
  };

  paging(index: number) {
    console.log('paging to page ' + index.toString());

    this.updatePagingNumber(index);
    this.getFavoritors();
  }
  previousPage() {
    if (this.PagingInfo.index == 1) {
      return;
    }
    this.updatePagingNumber(this.PagingInfo.index - 1);
    this.getFavoritors();
  }
  nextPage() {
    console.log(this.PagingInfo.index + ' ' + this.PagingInfo.total)
    if (this.PagingInfo.index == this.PagingInfo.total) {
      return;
    }

    this.updatePagingNumber(this.PagingInfo.index + 1);
    this.getFavoritors();
  }

  clickfilterName = () => {
    this.filterName = !this.filterName;
    this.Feature = "FullName";
    this.IsAscending = this.filterName;
    this.Filter();
  }
  clickfilterFollow = () => {
    this.filterFollower = !this.filterFollower;
    this.Feature = "Follow";
    this.IsAscending = this.filterFollower;
    this.Filter();
  }

  clickfilterFavorite = () => {
    this.filterFavorite = !this.filterFavorite;
    this.Feature = "Like";
    this.IsAscending = this.filterFavorite;
    this.Filter();
  }

  clickfilterImage = () => {
    this.filterImage = !this.filterImage;
    this.Feature = "ImageCount";
    this.IsAscending = this.filterImage;
    this.Filter();
  }

  clickfilterStatus = () =>{
    this.filterStatus = !this.filterStatus;
    this.Feature = "Status";
    this.IsAscending = this.filterStatus;
    this.Filter();
  }

  Filter(){
    this.Loading = true;
    this.usersService.FilterUsers(this.Feature, this.IsAscending, this.PagingInfo.index, this.PagingInfo.size)
      .then(response => {
        this.Loading = false;
        this.Users = response.data;
        this.PagingInfo.total = response.pageTotal;
      })
      .catch(err => console.log(err))
  }
}
