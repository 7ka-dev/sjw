import fs from "fs/promises";
import Papa from "papaparse";

export const readCsvFile = async (filePath: string): Promise<any[]> => {
  const data = await fs.readFile(filePath, "utf8");

  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      header: false,
      complete: (results: any) => {
        resolve(results.data);
      },
      error: (err: any) => {
        reject(err);
      },
    });
  });
};

export const writeCsvFile = async (
  dataset: string,
  filePath: string
): Promise<void> => {
  await fs.writeFile(filePath, dataset, "utf8");
};


export const hello = () => {
  console.log("hello");
};