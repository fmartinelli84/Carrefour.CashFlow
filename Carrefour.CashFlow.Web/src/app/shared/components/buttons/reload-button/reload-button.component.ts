import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-reload-button',
  templateUrl: './reload-button.component.html',
  styleUrls: ['./reload-button.component.scss']
})
export class ReloadButtonComponent extends BaseButtonComponent {

  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }
}
