type ObjectMap<T> = { [key: string]: T };

export const objectFlatter = (obj: ObjectMap<any>): ObjectMap<any> => {
  const stack: { obj: ObjectMap<any>; parentKey: string }[] = [{ obj, parentKey: "" }];
  const result: ObjectMap<any> = {};

  while (stack.length > 0) {
    const { obj: currentObj, parentKey } = stack.pop()!;

    for (const key in currentObj) {
      const newKey = parentKey ? `${parentKey}${key[0].toUpperCase() + key.substring(1)}` : key;
      const value = currentObj[key];

      if (typeof value === "object") {
        stack.push({ obj: value, parentKey: newKey });
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
};
