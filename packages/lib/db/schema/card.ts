import {
  pgEnum,
  pgTable as table,
  uuid,
  text,
  bigint,
} from "drizzle-orm/pg-core";
export const suiteEnum = pgEnum("suite", ["Prompt", "Response"]);

export const Card = table("card", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  suite: suiteEnum("suite").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  modifiedAt: bigint("modified_at", { mode: "number" }).notNull(),
});
