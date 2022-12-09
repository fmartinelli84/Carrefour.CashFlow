import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent extends BaseButtonComponent {

    constructor(changeDetector: ChangeDetectorRef) {
        super(changeDetector);
    }
}
