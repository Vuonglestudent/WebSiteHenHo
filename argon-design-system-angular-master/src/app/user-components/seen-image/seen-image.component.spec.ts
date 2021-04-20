import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeenImageComponent } from './seen-image.component';

describe('SeenImageComponent', () => {
  let component: SeenImageComponent;
  let fixture: ComponentFixture<SeenImageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeenImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeenImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
