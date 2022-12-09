import { Component } from '@angular/core';
import { BaseSubscriptionComponent } from '../../base-subscription.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parent-route-container',
  templateUrl: './parent-route-container.component.html',
  styleUrls: ['./parent-route-container.component.scss']
})
export class ParentRouteContainerComponent extends BaseSubscriptionComponent {

  public show: boolean = true;

  constructor() {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public routerOutletActivated(component: any) {
    this.show = false;
  }

  public routerOutletDeactivated(component: any) {
    this.show = true;
  }
}
