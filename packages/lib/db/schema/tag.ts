import { sql } from "drizzle-orm";
import {
  pgTable as table,
  uuid,
  varchar,
  bigint,
  index,
} from "drizzle-orm/pg-core";

export const Tag = table(
  "tag",
  {
    uuid: uuid("uuid").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    createdAt: bigint("created_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
    modifiedAt: bigint("modified_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      nameIdx: index("name_idx").on(t.name),
    };
  }
);
