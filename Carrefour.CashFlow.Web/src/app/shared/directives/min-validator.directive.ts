import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, Validators, AbstractControl } from '@angular/forms';

@Directive({
  selector: "[min][formControlName],[min][formControl],[min][ngModel]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinValidatorDirective),
      multi: true
    }
  ]
})
export class MinValidatorDirective implements Validator {
  private validator: ValidatorFn | null = null;

  private minValue:  number | Date | null = null;

  public get min():  number | Date | null {
    return this.minValue;
  }
  @Input() public set min(value:  number | Date | null) {

    if (!isNaN(parseFloat(<string><any>value))) {
      this.minValue = parseFloat(<string><any>value);

      this.validator = Validators.min(this.minValue);

    } else if (value && !isNaN(<any>new Date(<string><any>value))) {
      var dateValue = new Date(<string><any>value);

      this.minValue = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
    }
  }

  public validate(control: AbstractControl): { [key: string]: any } | null {

    if (this.minValue !== null && this.validator) {

      return this.validator(control);

    } else if (this.minValue !== null && control.value) {

      var dateValue = new Date(<string>control.value + 'T00:00:00');

      if (dateValue < this.minValue) {
        return {
          min: {
            min: this.minValue,
            value: dateValue
          }
        };
      }
    }

    return null;
  }

}
