import { toCsv } from "../utils/csv";

export abstract class CsvTemplate {
  protected abstract customHeaders: string[];
  getHeaders(): string[] {
    return this.customHeaders;
  }

  toCsv(withHeaders = false): string {
    return toCsv(this, this.getHeaders(), withHeaders);
  }
}
