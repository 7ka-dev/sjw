import {
  deleteCandidate,
  getCandidatesList,
  readCandidate,
} from "@sjw/sjw-lib/utils/fs/candidates.ts";
import { saveDataset } from "@sjw/sjw-lib/utils/fs/datasets.ts";
import { readMetadata } from "@sjw/sjw-lib/utils/fs/metadata.ts";
import { SetMetadata } from "@sjw/sjw-lib/types/types.js";
import { parseCandidate } from "@sjw/sjw-lib/parser/cah/candidates.ts";

const cleanseCandidate = async (
  candidate: string
): Promise<SetMetadata | undefined> => {
  const rows = await readCandidate(candidate);
  const dataset = await parseCandidate(rows);
  if (dataset.errors.length > 0) {
    // todo add errors to dataset file
    console.log(dataset.errors);
    return;
  }

  // todo add method to dataset
  const metadata: SetMetadata = {
    uuid: dataset.setDetails.uuid,
    name: dataset.setDetails.name,
  };

  await saveDataset(dataset);
  // await deleteCandidate(candidate); //!! SKIP FOR TESTING
  return metadata;
};

(async () => {
  try {
    const metadata = await readMetadata();
    const sjwMetadata: SetMetadata[] = metadata["SJW"] || [];
    const candidates = await getCandidatesList();
    for (const candidate of candidates) {
      const candidateExists = sjwMetadata.some((set) => set.name === candidate);
      if (candidateExists) {
        console.log(`Skipping candidate: ${candidate}`);
        continue;
      }
      console.log(`Processing candidate: ${candidate}`);
      await cleanseCandidate(candidate);
    }
  } catch (error) {
    console.error("Error processing candidates:", error);
  }
})();
