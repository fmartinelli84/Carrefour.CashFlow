export function getValueFromPath(item: any, path: string): any {
  if (typeof item === "object" && path) {
    let fields = path.split('.');
    let currentValue: any = null;

    for (var i = 0; i < fields.length; i++) {
      if (item) {
        currentValue = item[fields[i]];
        item = currentValue;
      } else {
        break;
      }
    }

    return currentValue;
  } else {
    return item;
  }
}
