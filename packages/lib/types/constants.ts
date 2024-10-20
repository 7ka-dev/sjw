import path from 'path';

export const DATA_STORAGE = path.resolve(__dirname, '../../../data');
export const CANDIDATE_STORAGE = path.join(DATA_STORAGE, 'candidates');
export const DATASET_STORAGE = path.join(DATA_STORAGE, 'datasets');
export const METADATA_FILE = path.join(DATA_STORAGE, "sets-metadata.json");
export const CAH_CANDIDATE_TEMPLATE = path.join(CANDIDATE_STORAGE, "cah-candidate-template.csv");

//readme files
export const DATA_STORAGE_README = path.join(DATA_STORAGE, "README.md");