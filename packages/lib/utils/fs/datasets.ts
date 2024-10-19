import { SetDataset } from "../../types/types";
import { DATASET_STORAGE } from "../../types/constants";
import fs from "fs/promises";
import path from "path";

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
