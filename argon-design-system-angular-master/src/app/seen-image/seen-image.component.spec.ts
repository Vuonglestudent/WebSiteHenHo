import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeenImageComponent } from './seen-image.component';

describe('SeenImageComponent', () => {
  let component: SeenImageComponent;
  let fixture: ComponentFixture<SeenImageComponent>;

  beforeEach(async(() => {
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
