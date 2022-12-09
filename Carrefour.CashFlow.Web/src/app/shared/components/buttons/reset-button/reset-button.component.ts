import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { BaseButtonComponent } from 'app/shared/components/base-button.component';

@Component({
  selector: 'app-reset-button',
  templateUrl: './reset-button.component.html',
  styleUrls: ['./reset-button.component.scss']
})
export class ResetButtonComponent extends BaseButtonComponent {

  @Input() public formComponent: IResetComponent = null;

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

  public reset(): void {
    this.formComponent?.reset();
  }
}

export interface IResetComponent {
  reset(): void;
}
