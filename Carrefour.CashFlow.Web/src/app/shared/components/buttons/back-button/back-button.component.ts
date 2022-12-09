import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Location } from '@angular/common';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent extends BaseButtonComponent {

  @Input() public historyBack: boolean = true;

  constructor(
    changeDetector: ChangeDetectorRef,
    private location: Location) {
    super(changeDetector);
  }

  public onClick(event: any): void {
    if (!event.defaultPrevented && this.historyBack) {
      this.location.back();
    }
  }
}
