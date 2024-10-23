import {
  pgTable as table,
  uuid,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";
import { Card } from "./card";
import { Edition } from "./edition";

export const CardEdition = table(
  "card_edition",
  {
    cardUuid: uuid("card_uuid")
      .notNull()
      .references(() => Card.uuid, { onDelete: "cascade" }),
    editionUuid: uuid("edition_uuid")
      .notNull()
      .references(() => Edition.uuid, { onDelete: "cascade" }),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    modifiedAt: bigint("modified_at", { mode: "number" }).notNull(),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.cardUuid, t.editionUuid] }),
    };
  }
);
