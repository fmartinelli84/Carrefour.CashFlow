import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullFormat'
})
export class NullFormatPipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return value === '' || value === null || value === undefined ? (args ? args : '-') : value;
  }

}
