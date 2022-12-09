import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidatorFn, Validators, AbstractControl } from '@angular/forms';

@Directive({
  selector: "[max][formControlName],[max][formControl],[max][ngModel]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxValidatorDirective),
      multi: true
    }
  ]
})
export class MaxValidatorDirective implements Validator {
  private validator: ValidatorFn | null = null;

  private maxValue: number | Date | null = null;

  public get max(): number | Date | null {
    return this.maxValue;
  }
  @Input() public set max(value: number | Date | null) {

    if (!isNaN(parseFloat(<string><any>value))) {
      this.maxValue = parseFloat(<string><any>value);

      this.validator = Validators.max(this.maxValue);

    } else if (value && !isNaN(<any>new Date(<string><any>value))) {
      var dateValue = new Date(<string><any>value);

      this.maxValue = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate());
    }
  }

  public validate(control: AbstractControl): { [key: string]: any } | null {

    if (this.maxValue !== null && this.validator) {

      return this.validator(control);

    } else if (this.maxValue !== null && control.value) {

      var dateValue = new Date(<string>control.value + 'T00:00:00');

      if (dateValue > this.maxValue) {
        return {
          max: {
            max: this.maxValue,
            value: dateValue
          }
        };
      }
    }

    return null;
  }
}
