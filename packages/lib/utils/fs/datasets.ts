import { SetDataset } from "../../types/types";
import { DATASET_STORAGE } from "../../types/constants";
import fs from "fs/promises";
import path from "path";
import { readCsvFile } from "../csv";

/**
 * Saves the provided dataset {@link SetDataset} to a file with set UUID in CSV format.
 *
 * @function
 * @async
 *
 * @param {SetDataset} dataset - The dataset object to be saved. It is expected to have a `toCsv` method that returns the CSV representation of the data.
 *
 * @returns {Promise<void>} A promise that resolves once the file has been successfully written.
 *
 * @throws {Error} If writing to the file fails.
 */
export const saveDataset = async (dataset: SetDataset): Promise<void> => {
  const filePath = path.join(DATASET_STORAGE, `${dataset.setDetails.uuid}.csv`);
  await fs.writeFile(filePath, dataset.toCsv(), "utf8");
};

/**
 * Retrieves the list of dataset files from the {@link DATASET_STORAGE}.
 *
 * @function
 * @async
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of dataset filenames.
 *
 * @throws {Error} If reading the directory fails.
 */
export const getDatasetList = async (): Promise<string[]> => {
  try {
    const files = await fs.readdir(DATASET_STORAGE);
    return files.filter(file => file.endsWith('.csv')); 
  } catch (error: any) {
    throw new Error(`Failed to list dataset files: ${error.message}`);
  }
};


/**
 * Reads and processes a CSV file from {@link DATASET_STORAGE}.
 *
 * @function
 * @async
 *
 * @param {string} fileName - The name of the file to read and process.
 *
 * @returns {Promise<any>} A promise that resolves with the CSV data from the file.
 *
 * @throws {Error} If reading the file or processing the CSV data fails.
 */
export const readDataset = async (fileName: string): Promise<any> => {
  try {
    // Construct the full file path
    const filePath = path.join(DATASET_STORAGE, fileName);

    // Read the CSV data from the file
    const csvData = await readCsvFile(filePath);

    return csvData;
  } catch (error: any) {
    throw new Error(`Failed to read CSV file ${fileName}: ${error.message}`);
  }
};