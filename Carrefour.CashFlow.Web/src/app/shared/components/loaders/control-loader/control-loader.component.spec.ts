import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ControlLoaderComponent } from './control-loader.component';

describe('ControlLoaderComponent', () => {
  let component: ControlLoaderComponent;
  let fixture: ComponentFixture<ControlLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
