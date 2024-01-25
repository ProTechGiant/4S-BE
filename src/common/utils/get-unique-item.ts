export type ItemType = { [key: string]: any };

export const getUniqueItemsByProperty = (items: ItemType[], property: string): ItemType[] => {
  const uniqueItems: ItemType[] = [];
  const seenValues: Set<any> = new Set();

  for (const item of items) {
    const value = item[property];
    if (!seenValues.has(value)) {
      seenValues.add(value);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
};
