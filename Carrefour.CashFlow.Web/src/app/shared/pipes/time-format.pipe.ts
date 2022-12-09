import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SupportedCultures } from 'app/core/models/localization/supported-cultures';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe extends DatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) locale: string) {
    super(locale ? locale : SupportedCultures.Default);
  }

  public override transform(value: any, args?: any): any {
    return super.transform(value ? new Date('0001-01-01T' + value) : null, 'shortTime');
  }

}
