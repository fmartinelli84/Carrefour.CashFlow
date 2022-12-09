import { AfterContentInit, AfterViewInit, ContentChild, Input, Directive } from '@angular/core';
import { BaseSubscriptionComponent } from 'app/shared/components/base-subscription.component';

@Directive({
  selector: '[app-label-header]'
})
export class LabelHeaderDirective {

  constructor() {
  }
}

@Directive()
export abstract class BaseLabelComponent extends BaseSubscriptionComponent implements AfterContentInit, AfterViewInit {

  @Input() public id: string = null;
  @Input() public name: string = null;
  @Input() public label: string = null;
  @Input() public type: string = 'text';

  @Input() public required: boolean = false;
  @Input() public readonly: boolean = false;
  @Input() public invalid: boolean = false;

  @ContentChild(LabelHeaderDirective) public labelHeader: LabelHeaderDirective;

  constructor() {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

  }

  public ngAfterContentInit(): void {

  }

  public ngAfterViewInit(): void {

  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
