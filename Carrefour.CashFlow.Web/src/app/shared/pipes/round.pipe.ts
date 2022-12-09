import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    if (value !== null && value !== undefined) {
      switch (args) {
        case 'ceil':
          return Math.ceil(value);
        case 'floor':
          return Math.floor(value);
        case 'round':
        default:
          return Math.round(value);
      }
    } else {
      return value;
    }
  }

}
