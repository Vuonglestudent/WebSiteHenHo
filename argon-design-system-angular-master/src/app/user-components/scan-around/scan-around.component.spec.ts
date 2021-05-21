import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanAroundComponent } from './scan-around.component';

describe('ScanAroundComponent', () => {
  let component: ScanAroundComponent;
  let fixture: ComponentFixture<ScanAroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanAroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanAroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
