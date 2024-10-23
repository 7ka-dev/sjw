import {
  pgTable as table,
  uuid,
  varchar,
  text,
  bigint,
} from "drizzle-orm/pg-core";

export const Ability = table("ability", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  modifiedAt: bigint("modified_at", { mode: "number" }).notNull(),
});