import { v4 } from "uuid";
import { toCsv } from "../../utils/csv";
import {
  Card,
  Edition,
  ParsingError,
  SetDataset,
  SetDetails,
} from "../../types/types";
export const CARD_HEADERS = [
  "uuid",
  "suite",
  "text",
  "draw",
  "pick",
  "editions",
];
export const EDITION_HEADERS = [
  "uuid",
  "edition",
  "version",
  "description",
  "author",
  "releaseDate",
];
export const SET_DETAILS_HEADERS = ["uuid", "name", "description"];

export const NewCard = (
  editions: string[],
  customHeaders: string[] = CARD_HEADERS
): Card => {
  const card: Card = {
    uuid: v4(),
    suite: "Response",
    text: "",
    draw: 0,
    pick: 0,
    getHeaders: () => [...customHeaders, ...editions],
    toCsv(withHeaders = false) {
      return toCsv(this, this.getHeaders(), withHeaders);
    },
  };

  editions.forEach((uuid) => {
    card[uuid] = "";
  });

  return card;
};

export const NewEdition = (
  customHeaders: string[] = EDITION_HEADERS
): Edition => ({
  uuid: v4(),
  edition: "",
  version: "",
  description: "",
  releaseDate: "",
  author: "",
  column: 0,
  getHeaders() {
    return customHeaders;
  },
  toCsv(withHeaders = false) {
    return toCsv(this, this.getHeaders(), withHeaders);
  },
});

export const NewSetDetails = (
  customHeaders: string[] = SET_DETAILS_HEADERS
): SetDetails => ({
  uuid: v4(),
  name: "",
  description: "",
  getHeaders() {
    return customHeaders;
  },
  toCsv(withHeaders = false) {
    return toCsv(this, this.getHeaders(), withHeaders);
  },
});

export const NewDataset = (
  cardHeaders: string[] = CARD_HEADERS,
  editionHeaders: string[] = EDITION_HEADERS
): SetDataset => ({
  setDetails: NewSetDetails(),
  currentLine: 0,
  editions: [],
  cards: [],
  errors: [],
  getHeaders() {
    return [];
  },
  toCsv() {
    const csvData: string[] = [];

    csvData.push(this.setDetails.toCsv(true));
    csvData.push("");

    this.editions.forEach((edition, index) => {
      csvData.push(edition.toCsv(index === 0));
    });
    if (this.editions.length > 0) csvData.push("");

    this.cards.forEach((card, index) => {
      csvData.push(card.toCsv(index === 0));
    });

    return csvData.join("\n");
  },
  hasErrors() {
    return this.errors.length > 0;
  },
  appendError(error: ParsingError) {
    this.errors.push(error);
  },
});
