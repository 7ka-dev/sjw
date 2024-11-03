import { validate, version } from "uuid";
import {
  EDITION_VERSION_REGEX,
  RESPONSE_PLACEHOLDER_REGEX,
} from "../../types/regex";
import { Dataset } from "../../templates/cah/dataset";
import { ParsingError } from "../../templates/errors";
import {
  SET_CARD_HEADERS,
  SET_DETAILS_HEADERS,
  SET_EDITION_HEADERS,
} from "../../templates/cah/headers";
import { Edition } from "templates/cah/edition";
import { CardEditionMap, SetDataset } from "types/types";
import { Card } from "templates/cah/card";

export const parseCahDataset = async (rows: any[]): Promise<SetDataset> => {
  const dataset = new Dataset();
  rows = ParseSetDetails(rows, dataset);
  rows = ParseEditions(rows, dataset);
  rows = ParseCards(rows, dataset);
  if (rows.length > 0) {
    dataset.appendError(
      new ParsingError("Unexpected row after cards", dataset.currentLine, 0)
    );
  }
  return dataset;
};

const validateHeaders = (headers: string[], row: any[]) => {
  if (headers.length !== row.length) {
    throw new Error("Row length does not match headers length");
  }

  if (headers.some((header, index) => header !== row[index])) {
    throw new Error("Row does not match the headers");
  }
};

const validateUuid = (uuid: string) => {
  if (!uuid || !validate(uuid) || version(uuid) !== 4) {
    throw new Error("Invalid UUID v4");
  }
};

const validateString = (
  str: string,
  pattern?: RegExp,
  mustContain: boolean = true
) => {
  // Check if the string is empty
  if (!str || typeof str !== "string" || str.trim() === "") {
    throw new Error("String cannot be empty");
  }

  if (!pattern) return;
  // If a pattern is provided
  if (mustContain && !pattern.test(str)) {
    // If the string must contain the pattern but doesn't
    throw new Error(`String must contain the required pattern: ${pattern}`);
  }
  if (!mustContain && pattern.test(str)) {
    // If the string must not contain the pattern but does
    throw new Error(`String must not contain the pattern: ${pattern}`);
  }
};

const validateDate = (date: string) => {
  if (date && !isNaN(Date.parse(date))) {
    throw new Error("Value must be a valid date");
  }
};
const validateNumber = (num: number) => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Value must be a valid number");
  }
};

const validateSuite = (suite: string) => {
  if (suite !== "Prompt" && suite !== "Response") {
    throw new Error(
      `Invalid suite: ${suite}. Must be either 'Prompt' or 'Response'.`
    );
  }
};

const validateSetDetails = (row: any[]) => {
  const uuid = row[0];
  const name = row[1];

  validateUuid(uuid);
  validateString(name);
};

const validateEditionDetails = (row: any[]) => {
  const uuid = row[0];
  const version = row[2];
  validateUuid(uuid);
  validateString(version, EDITION_VERSION_REGEX);
  validateDate(row[4]);
};

const validateCardDetails = (row: any[], editions: CardEditionMap) => {
  const uuid = row[0];
  const suite = row[1];
  const text = row[2];
  const draw = parseInt(row[3], 10);
  const pick = parseInt(row[4], 10);

  validateUuid(uuid);
  validateSuite(suite);
  validateString(text, RESPONSE_PLACEHOLDER_REGEX, false);
  validateNumber(draw);
  validateNumber(pick);

  Object.entries(editions).forEach(([uuid, column]) => {
    const cardEditionColumn = column + SET_CARD_HEADERS.length;
    const cardEdition = row[cardEditionColumn];
    if (cardEdition !== "" && cardEdition !== uuid) {
      throw new Error(`Invalid card edition: ${cardEdition}.`);
    }
  });
};

const isRowEmpty = (row: any[]) => {
  if (row.length === 0) {
    return true;
  }

  return !row.some((value: string) => value !== "");
};

const ParseSetDetails = (rows: any[], dataset: SetDataset): any[] => {
  validateHeaders(SET_DETAILS_HEADERS, rows[0]);
  validateSetDetails(rows[1]);
  dataset.details.uuid = rows[1][0];
  dataset.details.name = rows[1][1];
  dataset.details.description = rows[1][2];
  return rows.slice(3);
};

const ParseEditions = (rows: any[], dataset: SetDataset): any[] => {
  validateHeaders(SET_EDITION_HEADERS, rows[0]);
  const separatorIdx = rows.findIndex((row) => isRowEmpty(row));
  const editionRows =
    separatorIdx !== -1 ? rows.slice(1, separatorIdx) : rows.slice(1);
  if (editionRows.length === 0) {
    throw new Error("At least one edition must exist.");
  }
  const editions: Edition[] = [];
  editionRows.forEach((row) => {
    validateEditionDetails(row);
    const edition = new Edition();
    edition.uuid = row[0];
    edition.edition = row[1];
    edition.version = row[2];
    edition.description = row[3];
    edition.releaseDate = row[4] ? new Date(row[4]).getTime() : null;
    edition.author = row[5];
    edition.column = parseInt(row[6], 10);
    editions.push(edition);
  });
  dataset.editions = editions;
  return separatorIdx !== -1 ? rows.slice(separatorIdx + 1) : [];
};

export const normalizePromptPlaceholder = (text: string): string => {
  return text.replace(RESPONSE_PLACEHOLDER_REGEX, "_____");
};

export const ParseCards = (rows: any[], dataset: SetDataset): any[] => {
  const editionsMap: CardEditionMap = dataset.editions.reduce(
    (acc, edition) => ({ ...acc, [edition.uuid]: edition.column }),
    {} as CardEditionMap
  );
  validateHeaders([...SET_CARD_HEADERS, ...Object.keys(editionsMap)], rows[0]);
  const separatorIdx = rows.findIndex((row) => isRowEmpty(row));
  const cardRows =
    separatorIdx !== -1 ? rows.slice(1, separatorIdx) : rows.slice(1);
  if (cardRows.length === 0) {
    throw new Error("At least one card must exist.");
  }
  const cards: any[] = [];

  cardRows.forEach((row) => {
    validateCardDetails(row, editionsMap);
    const card = new Card(Object.keys(editionsMap));
    card.uuid = row[0];
    card.suite = row[1];
    card.text = row[2];
    card.draw = parseInt(row[3], 10);
    card.pick = parseInt(row[4], 10);
    dataset.editions.forEach((edition) => {
      const editionValue = row[edition.column + SET_CARD_HEADERS.length];
      if (editionValue) {
        card[edition.uuid] = edition.uuid;
      }
    });
    cards.push(card);
  });
  dataset.cards = cards;
  return separatorIdx !== -1 ? rows.slice(separatorIdx + 1) : [];
};
