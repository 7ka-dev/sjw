import fs from "fs/promises";
import { METADATA_FILE } from "../../types/constants";
import { GameName, Metadata, SetMetadata } from "../../types/types";

/**
 * Reads the card dataset metadata from the file system.
 *
 * @function
 * @async
 *
 * @remarks
 * This function reads the metadata from the file located at {@link METADATA_FILE}.
 * The file is expected to contain valid JSON data representing game metadata.
 *
 * If the file does not exist or the data is malformed, an error is thrown.
 *
 * @returns {Promise<Metadata>} A promise that resolves to the game metadata.
 *
 * @throws {Error} If the metadata file is not found, cannot be read, or contains invalid data.
 */
export const readMetadata = async (): Promise<Metadata> => {
  try {
    const data = await fs.readFile(METADATA_FILE, "utf-8");
    const metadata: Metadata = JSON.parse(data);

    if (typeof metadata !== "object" || metadata === null) {
      throw new Error("Invalid metadata format");
    }

    return metadata;
  } catch (error: any) {
    throw new Error(`Failed to read metadata: ${error.message}`);
  }
};

/**
 * Initializes the card dataset metadata file by writing an empty object to it.
 *
 * @function
 * @async
 *
 * @remarks
 * This function initializes the file located at {@link METADATA_FILE} by writing an empty object `{}`.
 * If the file already exists, it will be overwritten with this new content.
 *
 * The purpose of this function is to ensure that the metadata file is initialized with a valid JSON object.
 *
 * @returns {Promise<void>} A promise that resolves when the file has been successfully initialized.
 *
 * @throws {Error} If the file cannot be created or written to.
 */
export const createMetadataFile = async (): Promise<void> => {
  try {
    await fs.writeFile(METADATA_FILE, JSON.stringify({}, null, 2), "utf-8");
    console.log("Metadata file created (or overwritten) with an empty object.");
  } catch (error: any) {
    throw new Error(`Failed to create metadata file: ${error.message}`);
  }
};

/**
 * Writes the provided card dataset metadata to the file system.
 *
 * @function
 * @async
 *
 * @remarks
 * This function writes the given metadata object to the file located at {@link METADATA_FILE}.
 * The metadata is serialized as a formatted JSON string before being written to the file.
 *
 * If the file already exists, it will be overwritten with the new metadata.
 *
 * @param {Metadata} metadata - The game metadata object to be written to the file.
 *
 * @returns {Promise<void>} A promise that resolves when the metadata has been successfully written.
 *
 * @throws {Error} If the metadata file cannot be written to.
 */
export const writeMetadata = async (metadata: Metadata): Promise<void> => {
  try {
    await fs.writeFile(
      METADATA_FILE,
      JSON.stringify(metadata, null, 2),
      "utf-8"
    );
  } catch (error: any) {
    throw new Error(`Failed to write metadata: ${error.message}`);
  }
};

/**
 * Updates the metadata by overriding the existing game set metadata for the specified game.
 *
 * @function
 * @async
 *
 * @remarks
 * This function reads the current metadata from the file located at {@link METADATA_FILE},
 * replaces the existing set metadata for the specified game with the provided set metadata array,
 * and then writes the updated metadata back to the file.
 *
 * @param {GameName} game - The name of the game whose metadata should be replaced.
 * @param {SetMetadata[]} setDetails - An array of set metadata objects to overwrite the game's metadata.
 *
 * @returns {Promise<void>} A promise that resolves when the metadata has been successfully updated.
 *
 * @throws {Error} If reading or writing the metadata file fails.
 */
export const setGameMetadata = async (
  game: GameName,
  setDetails: SetMetadata[]
): Promise<void> => {
  try {
    // Read the current metadata
    const metadata: Metadata = await readMetadata();

    // Override the game metadata with the new setDetails
    metadata[game] = setDetails;

    // Write the updated metadata back to the file
    await writeMetadata(metadata);
  } catch (error: any) {
    throw new Error(`Failed to update metadata: ${error.message}`);
  }
};
