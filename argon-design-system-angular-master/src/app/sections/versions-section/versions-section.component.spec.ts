import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VersionsSectionComponent } from './versions-section.component';

describe('VersionsSectionComponent', () => {
  let component: VersionsSectionComponent;
  let fixture: ComponentFixture<VersionsSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionsSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
