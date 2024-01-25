import { createObjectCsvStringifier } from "csv-writer";
import { camelToTitle } from "./camel-to-title.case";
import { objectFlatter } from "./flat-object";
import fs from "fs";

type ObjectMap<T> = { [key: string]: T };

export const csvGenerator = (columnNames: string[], queryData: ObjectMap<any>[]): string => {
  const filePath = __dirname + "/csv/output.csv";

  const header = csvHeaderGenerator(columnNames);
  const formattedData = formatData(queryData, columnNames);

  const csvStringifier = createObjectCsvStringifier({
    header,
  });

  const csvString = csvStringifier.getHeaderString().concat(csvStringifier.stringifyRecords(formattedData));
  fs.writeFile(filePath, csvString, () => {});
  return csvString;
};

const csvHeaderGenerator = (columnNames: string[]) => {
  return columnNames.map((columnName: string) => ({ id: columnName, title: camelToTitle(columnName) }));
};

const formatData = (queryData: ObjectMap<any>[], columnNames: string[]): ObjectMap<any>[] => {
  return queryData.map((item) => {
    const formattedItem: ObjectMap<any> = {};
    for (const columnName of columnNames) {
      if (item[columnName]) formattedItem[columnName] = JSON.stringify(item[columnName]);
      const flatObject = objectFlatter(item);
      Object.keys(flatObject).forEach((key) => {
        if (key === columnName) formattedItem[columnName] = flatObject[key];
      });
    }
    return formattedItem;
  });
};
