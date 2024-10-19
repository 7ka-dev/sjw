import path from 'path';

export const DATA_STORAGE = path.resolve(__dirname, '../../../data');
export const CANDIDATE_STORAGE = path.join(DATA_STORAGE, 'candidates');
export const DATASET_STORAGE = path.join(DATA_STORAGE, 'datasets');
export const METADATA_FILE = path.join(DATA_STORAGE, "sets-metadata.json");