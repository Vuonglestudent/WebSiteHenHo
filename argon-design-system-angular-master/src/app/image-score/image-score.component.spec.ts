import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageScoreComponent } from './image-score.component';

describe('ImageScoreComponent', () => {
  let component: ImageScoreComponent;
  let fixture: ComponentFixture<ImageScoreComponent>;

  beforeEach(async(() => {
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
