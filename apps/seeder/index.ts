import { Metadata, SetMetadata } from "@sjw/sjw-lib/types/types.js";
import {
  saveDataset,
  getDatasetList,
  readDataset,
} from "@sjw/sjw-lib/utils/fs/datasets.ts";
import { readMetadata } from "@sjw/sjw-lib/utils/fs/metadata.ts";
import { parseCahDataset } from "@sjw/sjw-lib/parser/cah/datasets.ts";

const importDataset = async (fileName: string): Promise<SetMetadata> => {
  const rows = await readDataset(fileName);
  const dataset = await parseCahDataset(rows);
  console.log(dataset);
  //   const savedDataset = await seedDataset(dataset);

  //   // todo add method to dataset
  //   const metadata: SetMetadata = {
  //     uuid: savedDataset.setDetails.uuid,
  //     name: savedDataset.setDetails.name,
  //   };

  //   await saveDataset(savedDataset);
  const metadata: SetMetadata = {
    //!! TODO DELETE AFTER TESTING
    uuid: dataset.setDetails.uuid,
    name: dataset.setDetails.name,
  };

  return metadata;
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
