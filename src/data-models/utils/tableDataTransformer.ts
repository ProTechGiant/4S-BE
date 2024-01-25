import { removeDuplicatesByKey } from "../../common/utils/remove-dublicates";

type KeyValueType = string | number;

interface PropertyRecord {
  [propertyName: string]: KeyValueType;
}

interface TransformedDataItem {
  [property: string]: KeyValueType | TransformedDataItem[] | PropertyRecord[];
}

export function tableDataTransformer<RecordType extends PropertyRecord>(records: RecordType[], uniqueKey: string): TransformedDataItem[] {
  const [uniqueKeyProperty] = uniqueKey.split(".");
  const transformedData: TransformedDataItem[] = [];

  records.forEach((record) => {
    const currentIndex = transformedData.findIndex((obj) => obj[uniqueKeyProperty] === record[uniqueKeyProperty]);

    if (currentIndex === -1) {
      const newTransformedDataItem: TransformedDataItem = {
        [uniqueKeyProperty]: record[uniqueKeyProperty],
      };

      transformedData.push(newTransformedDataItem);
    }

    const currentObject = transformedData[currentIndex];

    if (!currentObject) {
      return;
    }

    Object.entries(record).forEach(([property, value]) => {
      const [propertyKey] = property.split(".");

      if (propertyKey === uniqueKeyProperty) {
        currentObject[property] = value;
      } else {
        if (!currentObject[propertyKey]) {
          currentObject[propertyKey] = [];
        }

        const subObject: PropertyRecord = {};
        Object.entries(record).forEach(([subProperty, subValue]) => {
          const [subPropertyKey] = subProperty.split(".");
          if (subPropertyKey === propertyKey) {
            subObject[subProperty] = subValue;
          }
        });

        currentObject[propertyKey].push(subObject);
      }
    });
  });

  return transformedData;
}
