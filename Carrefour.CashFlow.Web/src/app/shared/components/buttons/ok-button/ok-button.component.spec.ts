import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OkButtonComponent } from './ok-button.component';

describe('OkButtonComponent', () => {
  let component: OkButtonComponent;
  let fixture: ComponentFixture<OkButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
