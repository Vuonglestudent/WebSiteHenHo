import { AlertService } from './../../shared/_alert/alert.service';
import { IUserInfo } from './../../models/models';
import { ImageService } from '../../shared/service/image.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/service/authentication.service';
import { User, ImageUser, ProfileData } from '../../models/models';
import { UsersService } from '../../shared/service/users.service';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../shared/_animates/animates';
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
    { featureId: -1, featureName: "Độ tuổi", value: [] },
    { featureId: -2, featureName: "Giới tính", value: [] },
    // { featureId: -3, featureName: "Địa chỉ", value: [] },
    // { featureId: -4, featureName: "Công việc", value: [] },
  ]

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  extend = false;
  faSpinner = faSpinner;

  userInfo: IUserInfo;
  constructor(
    private usersService: UsersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.authenticationService.userInfoObservable
      .subscribe(user => this.userInfo = user)
  }

  items: IHashTag[] = new Array();

  Loading = false;
  heightBody: number;
  Users: User[] = new Array();
  UserPage: any = {
    index: 1,
    size: 16,
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
        this.mappingProfileData(data)
        setTimeout(() => this.changeHeight(), 10)
      })
      .catch(error => console.log(error))
  }

  private mappingProfileData(data: ProfileData) {

    var n = 0;
    var ageGroups = [];
    var j = 0;
    data.ageGroup.forEach(element => {
      ageGroups.push({ valueId: j++, valueName: element.replace(/_/g, " ") });
    });

    this.filterSet[n++].value = ageGroups;
    this.filterSet[n++].value = [{ valueId: 1, valueName: 'Nam', }, { valueId: 0, valueName: "Nữ" }];

    data.features.forEach(item => {
      let details = [];
      item.featureDetails.forEach(element => {
        details.push({ valueId: element.id, valueName: element.content });
      });
      this.filterSet.push({ featureId: item.id, featureName: item.name, value: details });
    });

  }

  ngAfterViewInit(): void {
    var tagInputRemove = <HTMLElement>document.getElementsByTagName('tag-input-form')[0]
    tagInputRemove.setAttribute('hidden', 'true');
    tagInputRemove.setAttribute('disable', 'true');
  }

  setStatusValue = (e, featureId, featureName, valueId, valueName) => {

    var target = e.target
    if (target.className != 'btn fa active-btn') {
      target.className = 'btn fa active-btn';

      var newHashTag = {
        feature: featureName,
        display: valueName,
        title: featureName,
        valueId: valueId,
        valueName: valueName,
        featureId: featureId,
        featureName: featureName

      } as IHashTag;

      this.items.push(newHashTag)
    } else {
      target.className = 'btn fa';
      this.items.forEach((element, index) => {
        if (element.feature == featureName && element.display == valueName) {
          this.items.splice(index, 1)
        }
      });
    }
    setTimeout(() => this.changeHeight(), 10)
  }

  deleteHashTag = (e) => {
    var itemRemove = <HTMLElement>document.getElementById(`${e.featureId}_${e.valueId}`)
    itemRemove.className = 'btn fa';
    setTimeout(() => this.changeHeight(), 10)
  }

  changeHeight = () => {
    var heightFilter = <HTMLElement>document.getElementsByClassName('col-8 col-xl-8 col-md-8 filterblock')[0]
    this.heightBody = 250 + heightFilter.clientHeight - 100;
    var heightContentUsers = <HTMLElement>document.getElementById('contentUsers');
    heightContentUsers.style.top = String(`${this.heightBody}px`)
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
        this.Users = this.Users.concat(response.data);
        this.UserPage.total = response.pageTotal;

      })
      .catch(error => {
        this.Loading = false;
        this.alertService.clear();
        this.alertService.error("Lỗi server, vui lòng thử lại sau!", this.options);
      })

  }
  updatePagingNumber(page: number) {

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
    if (this.userInfo == undefined) {
      //this.LoginRequired();
      return;
    }
    this.router.navigate(['/profile', id]);
  }

  Favorite = (userId: string, event) => {

    if (this.userInfo == undefined) {
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

export interface IHashTag {
  feature: number,
  display: number,
  title: string,
  valueId: number,
  valueName: string,
  featureId: number,
  featureName: string
}