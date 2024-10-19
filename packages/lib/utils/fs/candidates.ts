import fs from "fs/promises";
import { CANDIDATE_STORAGE } from "../../types/constants";
import path from "path";
import { readCsvFile } from "../csv";
/**
 * Retrieves the list of candidate files from the {@link CANDIDATE_STORAGE}.
 *
 * @function
 * @async
 *
 * @remarks
 * This function reads the directory located at {@link CANDIDATES_REPO} and returns
 * a list of filenames representing the candidate files.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of candidate filenames.
 *
 * @throws {Error} If reading the directory fails.
 */
export const getCandidatesList = async (): Promise<string[]> => {
  try {
    const candidates = await fs.readdir(CANDIDATE_STORAGE);
    return candidates;
  } catch (error: any) {
    throw new Error(`Failed to read candidates list: ${error.message}`);
  }
};

/**
 * Reads and processes a CSV file from {@link CANDIDATE_STORAGE}.
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
export const readCandidate = async (fileName: string): Promise<any> => {
  try {
    // Construct the full file path
    const filePath = path.join(CANDIDATE_STORAGE, fileName);

    // Read the CSV data from the file
    const csvData = await readCsvFile(filePath);

    return csvData;
  } catch (error: any) {
    throw new Error(`Failed to read CSV file ${fileName}: ${error.message}`);
  }
};
