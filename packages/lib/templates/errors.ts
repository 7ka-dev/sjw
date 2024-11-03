import { CsvTemplate } from ".";

export const PARSING_ERROR_HEADERS = ["error", "line", "column"];

export class ParsingError extends CsvTemplate {
  error: string;
  line: number;
  column: number;
  protected customHeaders: string[];
  constructor(
    message: string,
    line: number,
    column: number,
    customHeaders: string[] = PARSING_ERROR_HEADERS
  ) {
    super();
    this.error = message;
    this.line = line;
    this.column = column;
    this.customHeaders = customHeaders;
  }
}

export class InvalidTemplateError extends ParsingError {
  constructor() {
    super("Invalid template: not found", 0, 0);
  }
}
