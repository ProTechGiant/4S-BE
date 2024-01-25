import { createReadStream } from "fs";
import csvParser from "csv-parser";

interface CSVRow {
  [key: string]: string | number | boolean | null;
}

export const CsvParser = (filePath: string) => {
  return new Promise((resolve, reject) => {
    const rows: CSVRow[] = [];

    const parser = csvParser({
      mapHeaders: ({ header }) => header.trim(),
    });

    createReadStream(filePath)
      .pipe(parser)
      .on("data", (row) => {
        let skipRow = false;
        const parsedRow: CSVRow = {};
        for (let key in row) {
          if (!row.hasOwnProperty(key)) return;
          const value = row[key];
          if (!value) skipRow = true;

          try {
            const parsedValue = JSON.parse(value);
            parsedRow[key] = parsedValue;
          } catch (error) {
            parsedRow[key] = value;
          }
        }
        if (!skipRow) {
          rows.push(parsedRow);
        }
      })
      .on("end", () => resolve(rows))
      .on("error", (error) => reject(error));
  });
};
