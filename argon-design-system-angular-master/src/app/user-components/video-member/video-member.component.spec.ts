import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VideoMemberComponent } from './video-member.component';

describe('VideoMemberComponent', () => {
  let component: VideoMemberComponent;
  let fixture: ComponentFixture<VideoMemberComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
