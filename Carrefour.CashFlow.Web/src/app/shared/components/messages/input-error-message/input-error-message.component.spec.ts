import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputErrorMessageComponent } from './input-error-message.component';

describe('InputErrorMessageComponent', () => {
  let component: InputErrorMessageComponent;
  let fixture: ComponentFixture<InputErrorMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
