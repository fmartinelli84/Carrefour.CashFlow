export function setValueFromPath(item: any, path: string, value: any, create: boolean = false): void {
  if (path) {
    let fields = path.split('.');
    let currentValue: any = null;

    for (var i = 0; i < fields.length; i++) {
      if (item) {

        if (i < fields.length - 1) {
          currentValue = item[fields[i]];
          item = currentValue;

          if (create && !item)
            item = {};

        } else {
          item[fields[i]] = value;
        }

      } else {
        break;
      }
    }
  }
}
