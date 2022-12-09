import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewButtonComponent } from './new-button.component';

describe('NewButtonComponent', () => {
  let component: NewButtonComponent;
  let fixture: ComponentFixture<NewButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
