import { v4 } from "uuid";
import { SET_DETAILS_HEADERS } from "./headers";
import { CsvTemplate } from "..";

export class SetDetails extends CsvTemplate {
  uuid: string;
  name: string;
  description: string;
  protected customHeaders: string[];

  constructor(customHeaders: string[] = SET_DETAILS_HEADERS) {
    super();
    this.uuid = v4();
    this.name = "";
    this.description = "";
    this.customHeaders = customHeaders;
  }
}
