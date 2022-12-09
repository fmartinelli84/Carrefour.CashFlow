import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-ok-button',
  templateUrl: './ok-button.component.html',
  styleUrls: ['./ok-button.component.scss']
})
export class OkButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}
