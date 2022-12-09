import { Component } from '@angular/core';
import { ControlLoaderComponent } from 'app/shared/components/loaders/control-loader/control-loader.component';

@Component({
  selector: 'app-input-loader',
  templateUrl: './input-loader.component.html',
  styleUrls: ['./input-loader.component.scss']
})
export class InputLoaderComponent extends ControlLoaderComponent {

  constructor() {
    super();
  }

}
