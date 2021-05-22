import { AuthenticationService } from 'src/app/shared/service/authentication.service';
import { AlertService } from './../../shared/_alert/alert.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IFeedback, IUserInfo } from 'src/app/models/models';
import { FeedbackService } from 'src/app/shared/service/feedback.service';
import { slideInOutAnimation } from 'src/app/shared/_animates/animates';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-shared-story',
  templateUrl: './shared-story.component.html',
  animations: [slideInOutAnimation],

  // attach the fade in animation to the host (root) element of this component
  host: { '[@slideInOutAnimation]': '' },
  styleUrls: ['./shared-story.component.scss']
})
export class SharedStoryComponent implements OnInit {

  constructor(
    private router: Router,
    private feedbackService: FeedbackService,
    private alertService: AlertService,
    private auService: AuthenticationService
  ) {
    this.auService.userInfoObservable
      .subscribe(user => {
        this.userInfo = user;
      })
  }

  faSpinner = faSpinner;

  userInfo: IUserInfo = {} as IUserInfo;

  pageIndex = 1;
  pageSize = 6;

  feedbacks: IFeedback[] = new Array();
  feedback: IFeedback = {} as IFeedback;

  isLoadingData = true;
  isCreating = false;


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoadingData = true;
    this.feedbackService.GetFeedbacks(this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.isLoadingData = false;
        this.feedbacks = data;
        console.log(this.feedbacks);
      }, err => {
        this.isLoadingData = false;
        this.alertService.error("Không thể lấy dữ liệu, vui lòng thử lại sau");
      })
  }


  onCreate() {

    console.log(this.feedback);
    if (!this.feedback.vote || this.feedback.vote == 0 || this.checkString(this.feedback.title) || this.checkString(this.feedback.content)) {
      this.alertService.warn("Hãy đánh giá và điền đầy đủ thông tin");

    }


    this.isCreating = true;
    this.feedback.userId = this.userInfo.id;

    this.feedbackService.CreateFeedback(this.feedback)
      .subscribe(data => {
        this.isCreating = false;
        this.alertService.success("Câu chuyện của bạn đã được chia sẻ");
        this.loadData();
      }, err => {
        this.isCreating = false;
        this.alertService.error("Có lỗi khi thêm dữ liệu");
      })
  }

  onDelete(feedbackId: number) {

  }

  onUpdate(feedback: IFeedback) {

  }

  update() {

  }


  onSignUp() {
    this.router.navigate(['/register']);
  }

  checkString(str: string) {
    return (!str || str.length === 0 || !str.trim());
  }

  isLoadingMore = false;
  isFinalPage = false;

  onMore() {
    this.pageIndex += 1;
    this.isLoadingMore = true;

    this.feedbackService.GetFeedbacks(this.pageIndex, this.pageSize)
      .subscribe(data => {
        this.isLoadingMore = false;

        if(data.length == 0){
          this.alertService.warn("Bạn đã đến trang cuối cùng");
          this.isFinalPage = true;
          return;
        }

        this.feedbacks = this.feedbacks.concat(data);

      }, err => {
        this.isLoadingMore = false;
        this.alertService.error("Không thể xem thêm");
      })
  }

}



