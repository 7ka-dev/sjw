import { v4 } from "uuid";
import { SET_EDITION_HEADERS } from "./headers";
import { CsvTemplate } from "..";

export class Edition extends CsvTemplate {
    uuid: string;
    edition: string;
    version: string;
    description: string;
    releaseDate: number | null;
    author: string;
    column: number;
    offset: number;
    protected customHeaders: string[];
    constructor(customHeaders: string[] = SET_EDITION_HEADERS) {
      super();
      this.uuid = v4();
      this.edition = "";
      this.version = "";
      this.description = "";
      this.releaseDate = 0;
      this.author = "";
      this.column = 0;
      this.offset = 0;
      this.customHeaders = customHeaders;
    }
}