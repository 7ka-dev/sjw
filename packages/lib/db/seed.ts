import { NewSet, NewEdition, NewCard, NewCardEdition } from "./types";
import { SetDataset } from "../types/types";
import * as schema from "./schema/index";
import {
  Card,
  CardAbility,
  CardEdition,
  CardSet,
  Edition,
} from "./schema/index";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const seedDataset = async (
  db: PostgresJsDatabase<typeof schema> & {
    close: () => Promise<void>;
  },
  dataset: SetDataset
): Promise<SetDataset> => {
  try {
    const abilities = await db.query.Ability.findMany({
      columns: {
        uuid: true,
        keyword: true,
      },
    });
    const newSet: NewSet = {
      uuid: dataset.setDetails.uuid,
      name: dataset.setDetails.name,
      description: dataset.setDetails.description,
    };
    if (abilities.length === 0) {
      throw new Error("No abilities found");
    }

    await db.insert(CardSet).values(newSet);

    for (const edition of dataset.editions) {
      const newEdition: NewEdition = {
        uuid: edition.uuid,
        setUuid: dataset.setDetails.uuid,
        edition: edition.edition,
        version: edition.version,
        description: edition.description,
        author: edition.author,
        releasedAt: edition.releaseDate,
      };

      await db.insert(Edition).values(newEdition);
    }

    for (const card of dataset.cards) {
      const newCard: NewCard = {
        uuid: card.uuid,
        text: card.text,
        suite: card.suite,
      };

      await db.insert(Card).values(newCard);

      for (const edition of dataset.editions) {
        if (!card[edition.uuid]) {
          continue;
        }
        const newCardEdition: NewCardEdition = {
          cardUuid: card.uuid,
          editionUuid: edition.uuid,
        };

        await db.insert(CardEdition).values(newCardEdition);
      }

      if (card.draw) {
        const drawAbility = abilities.find(
          (ability) => ability.keyword === "draw"
        );
        if (drawAbility) {
          await db.insert(CardAbility).values({
            cardUuid: card.uuid,
            abilityUuid: drawAbility.uuid,
            value: card.draw.toString(),
          });
        }
      }

      if (card.pick) {
        const pickAbility = abilities.find(
          (ability) => ability.keyword === "pick"
        );
        if (pickAbility) {
          await db.insert(CardAbility).values({
            cardUuid: card.uuid,
            abilityUuid: pickAbility.uuid,
            value: card.pick.toString(),
          });
        }
      }
    }
  } finally {
    // Ensure db connection is closed
    await db.close();
  }
  return dataset;
};
