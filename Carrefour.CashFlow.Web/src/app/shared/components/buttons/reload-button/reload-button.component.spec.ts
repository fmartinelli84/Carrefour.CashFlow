import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReloadButtonComponent } from './reload-button.component';

describe('ReloadButtonComponent', () => {
  let component: ReloadButtonComponent;
  let fixture: ComponentFixture<ReloadButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReloadButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
