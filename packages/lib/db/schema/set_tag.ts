import {
  pgTable as table,
  uuid,
  bigint,
  primaryKey,
} from "drizzle-orm/pg-core";
import { CardSet } from "./card_set";
import { Tag } from "./tag";
import { sql } from "drizzle-orm";

export const SetTag = table(
  "set_tag",
  {
    set_uuid: uuid("set_uuid")
      .notNull()
      .references(() => CardSet.uuid, { onDelete: "cascade" }),
    tag_uuid: uuid("tag_uuid")
      .notNull()
      .references(() => Tag.uuid, { onDelete: "cascade" }),
    createdAt: bigint("created_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
    modifiedAt: bigint("modified_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.set_uuid, t.tag_uuid] }),
    };
  }
);
