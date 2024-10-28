import {
  EDITION_VERSION_REGEX,
  RESPONSE_PLACEHOLDER_REGEX,
} from "../../types/regex";
import { Edition, SetDataset } from "../../types/types";
import { NewParsingError } from "./errors";
import { NewCard, NewDataset, NewEdition } from "./templates";

export const parseCandidate = async (rows: any[]): Promise<SetDataset> => {
  const dataset = NewDataset();
  rows = ParseSetDetails(rows, dataset);
  console.log(dataset.currentLine, " current line");
  rows = ParseCards(rows, dataset);
  if (rows.length > 0) {
    dataset.appendError(
      NewParsingError("Unexpected row after cards", dataset.currentLine, 0)
    );
  }
  return dataset;
};

const ParseSetDetails = (rows: any[], dataset: SetDataset): any[] => {
  let detailsSize = 2;
  if (rows.length < detailsSize) {
    dataset.appendError(NewParsingError("Not enough rows to parse SetDetails"));
  }
  const editionOffset = rows[0][1] === "Edition" ? 1 : 0;
  detailsSize += editionOffset;
  dataset.currentLine = detailsSize;
  if (rows.length < detailsSize) {
    dataset.appendError(NewParsingError("Not enough rows to parse SetDetails"));
  }
  const editions: Edition[] = [];

  if (rows[editionOffset][0] !== "Set")
    dataset.appendError(
      NewParsingError('Set details are missing "Set"', editionOffset, 0)
    );
  if (rows[editionOffset][2] !== "Special") {
    dataset.appendError(
      NewParsingError('Set details are missing "Special"', editionOffset, 2)
    );
  }

  const setName = rows[editionOffset][1];
  if (!setName) {
    dataset.appendError(
      NewParsingError('Set details are missing "Name"', editionOffset, 1)
    );
  }
  dataset.setDetails.name = setName;
  dataset.setDetails.description = rows[editionOffset + 1][1] || "";
  const CARD_EDITIONS_START = 3;
  for (let i = 0; i < rows[editionOffset].length - CARD_EDITIONS_START; i++) {
    const templateColumn = CARD_EDITIONS_START + i;
    if (!EDITION_VERSION_REGEX.test(rows[editionOffset][templateColumn])) {
      console.log(rows[editionOffset][templateColumn]);
      dataset.appendError(
        NewParsingError(
          `version must be in the format vX.X`,
          editionOffset,
          templateColumn
        )
      );
      continue;
    }
    const edition = NewEdition();
    edition.version = rows[editionOffset][templateColumn];
    if (editionOffset > 0) {
      edition.edition = rows[0][templateColumn];
    }
    edition.offset = CARD_EDITIONS_START;
    edition.column = i;
    editions.push(edition);
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
      console.log("empty row", i);
      continue; // skip empty rows
    }
    const suite = rows[i][0];
    if (suite !== "Prompt" && suite !== "Response") {
      console.log(dataset.currentLine, " current line");
      console.log(rows[i]);
      console.log(i), " i";
      dataset.appendError(
        NewParsingError(
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
        NewParsingError("Card text is missing", dataset.currentLine + i, 1)
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

    const card = NewCard(dataset.editions.map((edition) => edition.uuid));

    dataset.editions.forEach((edition) => {
      const editionValue = rows[i][edition.column + edition.offset];
      if (editionValue) {
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
