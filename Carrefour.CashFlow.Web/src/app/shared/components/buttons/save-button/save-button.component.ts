import { Component, OnInit, ChangeDetectorRef, HostListener, Output, EventEmitter } from '@angular/core';
import { BaseButtonComponent } from '../../base-button.component';

@Component({
  selector: 'app-save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})

export class SaveButtonComponent extends BaseButtonComponent {
  
  constructor(changeDetector: ChangeDetectorRef) {
    super(changeDetector);
  }


}
