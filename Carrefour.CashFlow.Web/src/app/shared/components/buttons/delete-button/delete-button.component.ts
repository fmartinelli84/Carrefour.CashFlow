import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}
