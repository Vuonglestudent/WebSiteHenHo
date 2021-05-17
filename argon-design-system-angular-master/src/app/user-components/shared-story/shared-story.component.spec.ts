import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedStoryComponent } from './shared-story.component';

describe('SharedStoryComponent', () => {
  let component: SharedStoryComponent;
  let fixture: ComponentFixture<SharedStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
