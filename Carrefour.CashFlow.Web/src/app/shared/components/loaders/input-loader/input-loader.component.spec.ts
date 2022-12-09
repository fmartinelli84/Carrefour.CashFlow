import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InputLoaderComponent } from './input-loader.component';

describe('InputLoaderComponent', () => {
  let component: InputLoaderComponent;
  let fixture: ComponentFixture<InputLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InputLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
