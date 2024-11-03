import { Dataset } from "../../templates/cah/dataset";
import {
  EDITION_VERSION_REGEX,
  RESPONSE_PLACEHOLDER_REGEX,
} from "../../types/regex";
import { SetDataset } from "../../types/types";
import { ParsingError } from "../../templates/errors";
import { Edition } from "../../templates/cah/edition";
import { nextVersion } from "../../templates/cah/version";
import { Card } from "../../templates/cah/card";

export const parseCandidate = async (rows: any[]): Promise<SetDataset> => {
  const dataset = new Dataset();
  rows = ParseSetDetails(rows, dataset);
  rows = ParseCards(rows, dataset);
  if (rows.length > 0) {
    dataset.appendError(
      new ParsingError("Unexpected row after cards", dataset.currentLine, 0)
    );
  }
  return dataset;
};

const ParseSetDetails = (rows: any[], dataset: SetDataset): any[] => {
  let detailsSize = 2;
  if (rows.length < detailsSize) {
    dataset.appendError(
      new ParsingError("Not enough rows to parse SetDetails", 0, 0)
    );
  }
  const editionOffset = rows[0][1] === "Edition" ? 1 : 0;
  detailsSize += editionOffset;
  dataset.currentLine = detailsSize;
  if (rows.length < detailsSize) {
    dataset.appendError(
      new ParsingError("Not enough rows to parse SetDetails", 0, 0)
    );
  }
  const editions: Edition[] = [];

  if (rows[editionOffset][0] !== "Set")
    dataset.appendError(
      new ParsingError('Set details are missing "Set"', editionOffset, 0)
    );
  if (rows[editionOffset][2] !== "Special") {
    dataset.appendError(
      new ParsingError('Set details are missing "Special"', editionOffset, 2)
    );
  }

  const setName = rows[editionOffset][1];
  if (!setName) {
    dataset.appendError(
      new ParsingError('Set details are missing "Name"', editionOffset, 1)
    );
  }
  dataset.details.name = setName;
  dataset.details.description = rows[editionOffset + 1][1] || "";
  const CARD_EDITIONS_START = 3;
  for (let i = 0; i < rows[editionOffset].length - CARD_EDITIONS_START; i++) {
    const templateColumn = CARD_EDITIONS_START + i;
    if (!EDITION_VERSION_REGEX.test(rows[editionOffset][templateColumn])) {
      dataset.appendError(
        new ParsingError(
          `version must be in the format vX.X`,
          editionOffset,
          templateColumn
        )
      );
      continue;
    }
    const edition = new Edition();
    edition.version = rows[editionOffset][templateColumn];
    if (editionOffset > 0) {
      edition.edition = rows[0][templateColumn];
    }
    edition.offset = CARD_EDITIONS_START;
    edition.column = i;
    editions.push(edition);
  }

  if (editions.length === 0) {
    const edition = new Edition();
    edition.version = nextVersion();
    edition.offset = CARD_EDITIONS_START;
    edition.column = 0;
    editions.push(edition);
    dataset.singleVersion = true;
  }

  dataset.editions = editions;

  return rows.slice(detailsSize);
};

const normalizePromptPlaceholder = (text: string): string => {
  return text.replace(RESPONSE_PLACEHOLDER_REGEX, "_____");
};

const ParseCards = (rows: any[], dataset: SetDataset): any[] => {
  for (let i = 0; i < rows.length; i++) {
    let hasErrors = false;
    if (rows[i].every((value: string) => value == "")) {
      dataset.currentLine += 1;
      continue; // skip empty rows
    }
    const suite: "Prompt" | "Response" = rows[i][0];
    if (suite !== "Prompt" && suite !== "Response") {
      dataset.appendError(
        new ParsingError(
          "Suite must be either 'Prompt' or 'Response'",
          dataset.currentLine + i,
          0
        )
      );
      hasErrors = true;
    }

    let cardText = rows[i][1];
    if (!cardText) {
      dataset.appendError(
        new ParsingError("Card text is missing", dataset.currentLine + i, 1)
      );
      hasErrors = true;
    }

    if (suite === "Prompt") {
      cardText = normalizePromptPlaceholder(cardText);
    }

    let draw: number | undefined = undefined;
    let pick: number | undefined = undefined;
    const special = rows[i][2];
    if (special) {
      const drawMatch = special.match(/DRAW (\d+)/i);
      const pickMatch = special.match(/PICK (\d+)/i);
      if (drawMatch) {
        draw = parseInt(drawMatch[1], 10);
      }

      if (pickMatch) {
        pick = parseInt(pickMatch[1], 10);
      }
    }

    const card = new Card(dataset.editions.map((edition) => edition.uuid));

    dataset.editions.forEach((edition) => {
      const editionValue = rows[i][edition.column + edition.offset];
      if (editionValue || dataset.singleVersion) {
        card[edition.uuid] = edition.uuid;
      }
    });

    if (hasErrors) {
      continue;
    }

    card.suite = suite;
    card.text = cardText;
    card.draw = draw || 0;
    card.pick = pick || 0;

    dataset.cards.push(card);
    dataset.currentLine += 1;
  }
  return rows.slice(dataset.currentLine);
};
