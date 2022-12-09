import { Component, forwardRef, Input, Optional, ChangeDetectorRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { BaseInputComponent } from 'app/shared/components/base-input.component';
import { LoaderService } from 'app/core/services/layouts/loader.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent extends BaseInputComponent {

  constructor(
    loaderService: LoaderService,
    @Optional() controlContainer: ControlContainer,
    changeDetector: ChangeDetectorRef) {
    super(loaderService, controlContainer, changeDetector);
  }
}
