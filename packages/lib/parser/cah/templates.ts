import { v4 } from "uuid";
import { toCsv } from "@sjw//tools/csv";
import { Card, Edition, ParsingError, SetDataset, SetDetails } from "@sjw/types/types";
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

// Utility for generating CSV with dynamic headers

// NewCard factory function
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
    getHeaders: () => [
      ...customHeaders,
      ...editions, // Adding edition UUIDs as columns
    ],
    toCsv(withHeaders = false) {
      return toCsv(this, this.getHeaders(), withHeaders);
    },
  };

  // Add dynamic edition fields to card
  editions.forEach((uuid) => {
    card[uuid] = "";
  });

  return card;
};

// NewEdition factory function
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

// NewSetDetails factory function
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

// NewDataset factory function
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

    // Append set details with headers
    csvData.push(this.setDetails.toCsv(true));
    csvData.push("");

    // Append editions
    this.editions.forEach((edition, index) => {
      csvData.push(edition.toCsv(index === 0));
    });
    if (this.editions.length > 0) csvData.push("");

    // Append cards
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
