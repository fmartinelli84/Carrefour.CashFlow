export class Enum {
  public static getValue<TEnum>(value: TEnum, type: any): TEnum {
    if (value === null || value === undefined)
      return null;

    if (isNaN(parseInt(<any>value))) {
      value = type[value];
    }
    return <any>parseInt(<any>value);
  }

  public static getName<TEnum>(value: TEnum, type?: any): TEnum {
    if (value === null || value === undefined)
      return null;
    
    if (isNaN(parseInt(<any>value))) {
      value = type[value];
    }
    return type[value];
  }

  public static getValues<TEnum>(value: TEnum, type: any): TEnum[] {
    let values: TEnum[] = [];

    if (value === null || value === undefined)
      return values;

    for (let enumMember in type) {
      if (!isNaN(parseInt(enumMember))) {
        if (Enum.hasValue(value, <any>enumMember, type)) {
          values.push(<any>parseInt(enumMember));
        }
      }
    }

    return values;
  }
  public static fromValues<TEnum>(values: TEnum[], type: any): TEnum {
    let value: TEnum = null;

    if (!values?.length)
      return null;

    values.forEach(v => {
      (<any>value) |= <any>Enum.getValue(v, type);
    });

    return value;
  }

  public static getNames<TEnum>(value: TEnum, type: any): TEnum[] {
    let values: TEnum[] = [];

    if (value === null || value === undefined)
      return values;

    for (let enumMember in type) {
      if (!isNaN(parseInt(enumMember))) {
        if (Enum.hasValue(value, <any>enumMember, type)) {
          values.push(type[enumMember]);
        }
      }
    }

    return values;
  }
  public static fromNames<TEnum>(values: TEnum[], type: any): TEnum {
    let value: TEnum = null;

    if (!values?.length)
      return null;

    value = <any>values
      .map(v => <any>Enum.getName(v, type))
      .join(', ');

    return value;
  }

  public static hasValue<TEnum>(value: TEnum, enumMember: TEnum, type: any): boolean {
    if (value === null || value === undefined || enumMember === null || enumMember === undefined)
      return false;

    if (isNaN(parseInt(<any>value))) {
      let valuesString = value.toString().split(', ');

      valuesString.forEach(valueString => {
        (<any>value) |= type[valueString];
      });
    }

    enumMember = Enum.getValue(enumMember, type);

    if ((<any>value & <any>enumMember) == <any>enumMember) {
      return true;
    }

    return false;
  }
}
