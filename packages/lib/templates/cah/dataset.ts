import { CsvTemplate } from "..";
import { Card, ParsingError, SetMetadata } from "../../types/types";
import { Edition } from "./edition";
import { SetDetails } from "./set_details";

export class Dataset extends CsvTemplate {
  details: SetDetails;
  currentLine: number;
  editions: Edition[];
  cards: Card[];
  errors: ParsingError[];
  singleVersion: boolean;
  protected customHeaders: string[];
  constructor(customHeaders: string[] = []) {
    super();
    this.details = new SetDetails();
    this.currentLine = 0;
    this.editions = [];
    this.cards = [];
    this.errors = [];
    this.singleVersion = false;
    this.customHeaders = customHeaders;
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  appendError(error: ParsingError) {
    this.errors.push(error);
  }

  get metadata(): SetMetadata {
    return {
      uuid: this.details.uuid,
      name: this.details.name,
      prompts: this.cards.filter((card) => card.type === "prompt").length,
      responses: this.cards.filter((card) => card.type === "response").length,
    };
  }

  toCsv(): string {
    const csvData: string[] = [];

    csvData.push(this.details.toCsv(true));
    csvData.push("");

    this.editions.forEach((edition, index) => {
      csvData.push(edition.toCsv(index === 0));
    });
    if (this.editions.length > 0) csvData.push("");

    this.cards.forEach((card, index) => {
      csvData.push(card.toCsv(index === 0));
    });

    return csvData.join("\r\n");
  }
}
