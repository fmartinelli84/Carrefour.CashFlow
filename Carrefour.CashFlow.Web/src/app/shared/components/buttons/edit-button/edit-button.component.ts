import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-edit-button',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }

}
