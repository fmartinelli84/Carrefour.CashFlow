import { Component, OnInit, Input } from '@angular/core';
import { BaseInputComponent } from 'app/shared/components/base-input.component';

@Component({
  selector: 'app-input-error-message',
  templateUrl: './input-error-message.component.html',
  styleUrls: ['./input-error-message.component.scss']
})
export class InputErrorMessageComponent implements OnInit {

  @Input() public for: BaseInputComponent = null;
  @Input() public show: boolean = false;

  constructor() { }

  public ngOnInit(): void {
  }

}
