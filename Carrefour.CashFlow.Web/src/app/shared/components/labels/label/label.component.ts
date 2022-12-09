import { Component, Directive } from '@angular/core';
import { BaseLabelComponent } from 'app/shared/components/base-label.component';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent extends BaseLabelComponent {

  constructor() {
    super();

    this.readonly = true;
  }
}
