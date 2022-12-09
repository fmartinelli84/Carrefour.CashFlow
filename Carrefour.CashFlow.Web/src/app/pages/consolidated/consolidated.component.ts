import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsolidatedService } from 'app/core/services/consolidated.service';
import { BaseModelComponent } from 'app/shared/components/base-model.component';

@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss']
})
export class ConsolidatedComponent extends BaseModelComponent<any[]> {

  constructor(
    changeDetector: ChangeDetectorRef,
    private consolidatedService: ConsolidatedService,
    private activeRoute: ActivatedRoute) {
    super(changeDetector);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.activeRoute.url.subscribe(params => {
      this.load();
    });
  }

  public load(): void {
    this.consolidatedService.getAll().subscribe(data => {
      this.model = data;
    });
  }
}
