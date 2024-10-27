export type GameName = "CAH" | "SJW";

export const gameNameMap: Record<GameName, string> = {
  CAH: "Cards Against Humanity",
  SJW: "Sleepy Joe's Will",
};

export type SetMetadata = {
  uuid: string;
  name: string;
};

export type Metadata = Partial<Record<GameName, SetMetadata[]>>;

export type CardEditionMap = Record<string, number>;

export type CsvTemplate = {
  toCsv: (withHeaders?: boolean) => string;
  getHeaders: () => string[];
};

export type SetDetails = CsvTemplate & {
  uuid: string;
  name: string;
  description: string;
};

export type Edition = CsvTemplate & {
  uuid: string;
  description: string;
  edition: string;
  version: string;
  releaseDate: number|null;
  author: string;
  column: number;
  offset: number;
};

export type Card = CsvTemplate & {
  uuid: string;
  suite: "Prompt" | "Response";
  text: string;
  draw: number;
  pick: number;
  [key: string]: any;
};

export type SetDataset = CsvTemplate & {
  setDetails: SetDetails;
  editions: Edition[];
  cards: Card[];
  errors: ParsingError[];
  currentLine: number;
  hasErrors: () => boolean;
  appendError: (error: ParsingError) => void;
};

export type ParsingError = CsvTemplate & {
  error: string;
  line: number;
  column: number;
};
