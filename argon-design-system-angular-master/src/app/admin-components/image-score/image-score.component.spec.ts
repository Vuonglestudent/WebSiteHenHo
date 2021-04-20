import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageScoreComponent } from './image-score.component';

describe('ImageScoreComponent', () => {
  let component: ImageScoreComponent;
  let fixture: ComponentFixture<ImageScoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
