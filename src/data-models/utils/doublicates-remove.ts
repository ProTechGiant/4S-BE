interface AnyObject {
  [key: string]: any;
}

export const duplicatesRemover = <T extends AnyObject, K extends keyof T>(array: T[], uniqueKey: K): T[] => {
  const uniqueMap = new Map<T[K], T>();

  array.forEach((item) => {
    const key = item[uniqueKey];

    // Handle undefined values for the unique key
    if (key !== undefined && !uniqueMap.has(key)) {
      uniqueMap.set(key, item);
    }
  });

  return Array.from(uniqueMap.values());
};
