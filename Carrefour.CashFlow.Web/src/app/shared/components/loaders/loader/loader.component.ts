import { Component, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from 'app/core/services/layouts/loader.service';
import { BaseSubscriptionComponent } from 'app/shared/components/base-subscription.component';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent extends BaseSubscriptionComponent {

  public show: boolean = false;

  private showCount: number = 0;

  constructor(
    private loaderService: LoaderService) {
    super();
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    this.subscriptions.add(this.loaderService.loader
      .subscribe(state => {
        if (state)
          this.showCount++;
        else if (this.showCount > 0)
          this.showCount--;

        this.show = !!this.showCount;
      }));
  }
}
