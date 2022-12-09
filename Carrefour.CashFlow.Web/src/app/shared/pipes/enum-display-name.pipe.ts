import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumDisplayName'
})
export class EnumDisplayNamePipe implements PipeTransform {

  public transform(value: any, args?: any, field?: any): any {
       

    if(Array.isArray(value)){
      let enums : any[] = [];

      (<Array<any>>value)?.forEach(item => {     
        if(field) 
          enums.push(this.getEnum(item[field], args));
        else
          enums.push(this.getEnum(item, args));
      });

      return enums;
    }else{
      
      return this.getEnum(value, args);
    }
  }

  private getEnum(value: any, args?: any): any{
    var enumMember: number;
    var enumType = args;

    if (!isNaN(value)) {
      enumMember = parseInt(value);
    }
    else {
      enumMember = parseInt(enumType[value]);
    }

    return enumType && enumType.toDisplayName ? enumType.toDisplayName(enumMember) : enumType ? enumType[enumMember] : enumMember;
  }

}
