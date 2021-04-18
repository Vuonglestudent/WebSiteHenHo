import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoMemberComponent } from './video-member.component';

describe('VideoMemberComponent', () => {
  let component: VideoMemberComponent;
  let fixture: ComponentFixture<VideoMemberComponent>;

  beforeEach(async(() => {
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
