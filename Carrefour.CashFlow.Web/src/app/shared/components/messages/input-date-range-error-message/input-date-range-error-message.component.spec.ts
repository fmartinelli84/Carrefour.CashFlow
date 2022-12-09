import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputDateRangeErrorMessageComponent } from './input-date-range-error-message.component';

describe('InputDateRangeErrorMessageComponent', () => {
  let component: InputDateRangeErrorMessageComponent;
  let fixture: ComponentFixture<InputDateRangeErrorMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDateRangeErrorMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateRangeErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
