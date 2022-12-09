import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-cancel-button',
  templateUrl: './cancel-button.component.html',
  styleUrls: ['./cancel-button.component.scss']
})
export class CancelButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}
