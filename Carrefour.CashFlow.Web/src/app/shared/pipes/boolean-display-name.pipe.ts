import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanDisplayName'
})
export class BooleanDisplayNamePipe implements PipeTransform {

  public transform(value: any, args?: any): any {
    return value ? `Sim` : `Não`;
  }
}
