import { Component, forwardRef, Input, SkipSelf, Optional, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlContainer } from '@angular/forms';
import { BaseInputComponent } from 'app/shared/components/base-input.component';
import { LoaderService } from 'app/core/services/layouts/loader.service';
import { BooleanDisplayNamePipe } from 'app/shared/pipes/boolean-display-name.pipe';

@Component({
  selector: 'app-boolean-input',
  templateUrl: './boolean-input.component.html',
  styleUrls: ['./boolean-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => BooleanInputComponent),
    multi: true
  }]
})
export class BooleanInputComponent extends BaseInputComponent {

  constructor(
    loaderService: LoaderService,
    @Optional() controlContainer: ControlContainer,
    changeDetector: ChangeDetectorRef) {
    super(loaderService, controlContainer, changeDetector);

    this.items = this.getNameValues();
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  private getNameValues(): { name: string, value: boolean }[] {
    var nameValues: { name: string, value: boolean }[] = [];

    var booleanDisplayNamePipe = new BooleanDisplayNamePipe();

    nameValues.push({
      name: booleanDisplayNamePipe.transform(true),
      value: true
    });

    nameValues.push({
      name: booleanDisplayNamePipe.transform(false),
      value: false
    });

    return nameValues;
  }
}
