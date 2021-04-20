import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FilterFriendsComponent } from './filter-friends.component';

describe('FilterFriendsComponent', () => {
  let component: FilterFriendsComponent;
  let fixture: ComponentFixture<FilterFriendsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
