import { ParsingError } from "@sjw/types/types";
import { toCsv } from "@sjw/tools/csv";

export const PARSING_ERROR_HEADERS = ["error", "line", "column"];
export const NewParsingError = (
  message: string,
  line: number = 0,
  column: number = 0,
  customHeaders: string[] = PARSING_ERROR_HEADERS
): ParsingError => ({
  error: message,
  line,
  column,
  getHeaders() {
    return customHeaders;
  },
  toCsv(withHeaders = false) {
    return toCsv(
      {
        error: this.error,
        line: this.line === 0 ? "" : this.line,
        column: this.column === 0 ? "" : this.column,
      },
      this.getHeaders(),
      withHeaders
    );
  },
});

export const InvalidTemplateSizeError = (): ParsingError => {
  return NewParsingError("Invalid template: not found");
};
