import {
  pgTable as table,
  uuid,
  bigint,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";
import { Card } from "./card";
import { sql } from "drizzle-orm";

export const CardAbility = table(
  "card_ability",
  {
    cardUuid: uuid("card_uuid")
      .notNull()
      .references(() => Card.uuid, { onDelete: "cascade" }),
    abilityUuid: uuid("ability_uuid")
      .notNull()
      .references(() => Card.uuid, { onDelete: "cascade" }),
    value: varchar("value", { length: 255 }).notNull(),
    createdAt: bigint("created_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
    modifiedAt: bigint("modified_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.cardUuid, t.abilityUuid] }),
    };
  }
);
