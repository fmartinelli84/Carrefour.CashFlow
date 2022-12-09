import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ComparisonOperator } from './comparison-operator';

export function comparisonValidator(
  startFormControlName: string,
  endFormControlName: string,
  type: string,
  operator: ComparisonOperator): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    var error = null;

    var startFormControl = control.get(startFormControlName);
    var endFormControl = control.get(endFormControlName);

    if (startFormControl && endFormControl &&
      startFormControl.valid && endFormControl.valid &&
      startFormControl.value && endFormControl.value) {

      var startValue = convertToType(startFormControl.value, type);
      var endValue = convertToType(endFormControl.value, type);

      var success = true;

      switch (operator) {
        case ComparisonOperator.LessThan:
          success = startValue < endValue;
          break;
        case ComparisonOperator.LessThanEqual:
          success = startValue <= endValue;
          break;
        case ComparisonOperator.GreaterThan:
          success = startValue > endValue;
          break;
        case ComparisonOperator.GreaterThanEqual:
          success = startValue >= endValue;
          break;
        case ComparisonOperator.NotEqual:
          success = startValue != endValue;
          break;
        case ComparisonOperator.Equal:
        default:
          success = startValue == endValue;
          break;
      }

      if (!success) {
        error = {
          comparison: {
            startFormControlName: startFormControlName,
            endFormControlName: endFormControlName,
            type: type,
            operator: operator,
            startValue: startFormControl.value,
            endValue: endFormControl.value
          }
        };
      }
    }

    return error;
  }
}

export function convertToType(value: any, type: string): any {

  if (type == 'number' || type == 'int') {

    return parseInt(value);

  } else if (type == 'float') {

    return parseFloat(value);

  } else if (type == 'date') {

    return new Date(value + 'T00:00:00');

  } else if (type == 'time') {

    return new Date('0001-01-01T' + value);

  } else {

    return value;
  }
}
