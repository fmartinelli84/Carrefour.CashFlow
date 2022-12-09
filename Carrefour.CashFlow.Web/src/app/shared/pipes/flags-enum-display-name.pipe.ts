import { Pipe, PipeTransform } from '@angular/core';
import { Enum } from 'app/core/enums/enum';
import { EnumDisplayNamePipe } from 'app/shared/pipes/enum-display-name.pipe';

@Pipe({
  name: 'flagsEnumDisplayName'
})
export class FlagsEnumDisplayNamePipe extends EnumDisplayNamePipe {

  public override transform(value: any, args?: any): any {
    var enumType = args;

    var values = Enum
      .getValues(value, enumType)
      .map(v => super.transform(v, enumType));

    return values;
  }

}
