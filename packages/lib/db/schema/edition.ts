import {
  pgTable as table,
  varchar,
  uuid,
  text,
  bigint,
} from "drizzle-orm/pg-core";
import { CardSet } from "./card_set";

export const Edition = table("edition", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  setUuid: uuid("set_uuid")
    .notNull()
    .references(() => CardSet.uuid),
  description: text("description"),
  edition: varchar("edition", { length: 55 }),
  version: varchar("version", { length: 15 }).notNull(),
  releasedAt: bigint("released_at", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  modifiedAt: bigint("modified_at", { mode: "number" }).notNull(),
});
