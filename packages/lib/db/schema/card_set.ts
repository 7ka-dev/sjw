import {
  pgTable as table,
  varchar,
  uuid,
  text,
  bigint,
} from "drizzle-orm/pg-core";

export const CardSet = table("card_set", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  modifiedAt: bigint("modified_at", { mode: "number" }).notNull(),
});
