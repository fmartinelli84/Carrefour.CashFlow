import { Component, OnInit } from '@angular/core';
import { InputErrorMessageComponent } from 'app/shared/components/messages/input-error-message/input-error-message.component';

@Component({
  selector: 'app-input-date-range-error-message',
  templateUrl: './input-date-range-error-message.component.html',
  styleUrls: ['./input-date-range-error-message.component.scss']
})
export class InputDateRangeErrorMessageComponent extends InputErrorMessageComponent {

  constructor() {
    super();
  }
}
