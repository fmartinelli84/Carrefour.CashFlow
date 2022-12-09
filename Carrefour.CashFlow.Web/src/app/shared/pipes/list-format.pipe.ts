import { Pipe, PipeTransform } from '@angular/core';
import { getValueFromPath } from 'app/core/value-accessors/get-value-from-path';

@Pipe({
  name: 'listFormat'
})
export class ListFormatPipe implements PipeTransform {

  public transform(value: any, field?: string, separator?: string): any {
    if (value && Array.isArray(value)) {
      return value
        .map(item => getValueFromPath(item, field))
        .join(separator ?? ', ');
    }
    return value;
  }

}
