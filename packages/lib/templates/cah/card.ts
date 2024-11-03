import { v4 } from "uuid";
import { SET_CARD_HEADERS } from "./headers";
import { CsvTemplate } from "..";
export class Card extends CsvTemplate {
  uuid: string;
  suite: "Prompt" | "Response";
  text: string;
  draw: number;
  pick: number;
  protected customHeaders: string[];
  private editions: string[];

  constructor(editions: string[], customHeaders: string[] = SET_CARD_HEADERS) {
    super();
    this.uuid = v4();
    this.suite = "Response";
    this.text = "";
    this.draw = 0;
    this.pick = 0;
    this.customHeaders = customHeaders;
    this.editions = editions;

    // Initialize editions as empty strings
    editions.forEach((uuid) => {
      (this as any)[uuid] = "";
    });
  }

  getHeaders(): string[] {
    return [...this.customHeaders, ...this.editions];
  }
}
