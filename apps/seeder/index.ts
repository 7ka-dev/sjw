import { Metadata, SetMetadata } from "@sjw/sjw-lib/types/types.js";
import { getDatasetList, readDataset } from "@sjw/sjw-lib/utils/fs/datasets.ts";
import { readMetadata } from "@sjw/sjw-lib/utils/fs/metadata.ts";
import { parseCahDataset } from "@sjw/sjw-lib/parser/cah/datasets.ts";
import { seedDataset } from "@sjw/sjw-lib/db/seed.ts";
import dotenv from "dotenv";
import { newDB } from "@sjw/sjw-lib/db/client.js";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const importDataset = async (fileName: string): Promise<SetMetadata> => {
  const rows = await readDataset(fileName);
  const dataset = await parseCahDataset(rows);
  console.log(dataset);
  const savedDataset = await seedDataset(
    newDB(process.env.DATABASE_URL as string),
    dataset
  );

  return savedDataset.metadata;
};

(async () => {
  try {
    const metadata: Metadata = await readMetadata();
    if (!metadata["SJW"]) {
      metadata["SJW"] = [];
    }
    const sjwMetadata: SetMetadata[] = metadata["SJW"] || [];
    const candidates = await getDatasetList();
    for (const candidate of candidates) {
      const candidateExists = sjwMetadata.some((set) => set.name === candidate);
      if (candidateExists) {
        console.log(`Skipping candidate: ${candidate}`);
        continue;
      }
      console.log(`Processing candidate: ${candidate}`);
      const setDetails = await importDataset(candidate);
      metadata["SJW"].push(setDetails);
    }
  } catch (error) {
    console.error("Error processing datasets:", error);
  }
})();
