import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParentRouteContainerComponent } from './parent-route-container.component';

describe('ParentRouteContainerComponent', () => {
  let component: ParentRouteContainerComponent;
  let fixture: ComponentFixture<ParentRouteContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentRouteContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentRouteContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
