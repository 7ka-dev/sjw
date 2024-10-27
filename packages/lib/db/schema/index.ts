import { sql } from "drizzle-orm";
import {
  pgTable as table,
  uuid,
  varchar,
  text,
  bigint,
  primaryKey,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
export const Ability = table("ability", {
  uuid: uuid("uuid").primaryKey().defaultRandom(),
  keyword: varchar("keyword", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: bigint("created_at", { mode: "number" })
    .notNull()
    .default(sql`extract(epoch from now())`),
  // modifiedAt: bigint("modified_at", { mode: "number" })
  //   .notNull()
  //   .default(sql`extract(epoch from now())`),
});

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
    // modifiedAt: bigint("modified_at", { mode: "number" })
    //   .notNull()
    //   .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.cardUuid, t.abilityUuid] }),
    };
  }
);

export const CardEdition = table(
  "card_edition",
  {
    cardUuid: uuid("card_uuid")
      .notNull()
      .references(() => Card.uuid, { onDelete: "cascade" }),
    editionUuid: uuid("edition_uuid")
      .notNull()
      .references(() => Edition.uuid, { onDelete: "cascade" }),
    createdAt: bigint("created_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
    // modifiedAt: bigint("modified_at", { mode: "number" })
    //   .notNull()
    //   .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.cardUuid, t.editionUuid] }),
    };
  }
);

export const CardSet = table("card_set", {
  uuid: uuid("uuid").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: bigint("created_at", { mode: "number" })
    .notNull()
    .default(sql`extract(epoch from now())`),
  // modifiedAt: bigint("modified_at", { mode: "number" })
  //   .notNull()
  //   .default(sql`extract(epoch from now())`),
});

export const suiteEnum = pgEnum("suite", ["Prompt", "Response"]);

export const Card = table("card", {
  uuid: uuid("uuid").primaryKey(),
  text: text("text").notNull(),
  suite: suiteEnum("suite").notNull(),
  createdAt: bigint("created_at", { mode: "number" })
    .notNull()
    .default(sql`extract(epoch from now())`),
  // modifiedAt: bigint("modified_at", { mode: "number" })
  //   .notNull()
  //   .default(sql`extract(epoch from now())`),
});

export const Edition = table("edition", {
  uuid: uuid("uuid").primaryKey(),
  setUuid: uuid("set_uuid")
    .notNull()
    .references(() => CardSet.uuid),
  description: text("description"),
  edition: varchar("edition", { length: 55 }),
  version: varchar("version", { length: 15 }).notNull(),
  author: varchar("author", { length: 255 }),
  releasedAt: bigint("released_at", { mode: "number" }),
  createdAt: bigint("created_at", { mode: "number" })
    .notNull()
    .default(sql`extract(epoch from now())`),
  // modifiedAt: bigint("modified_at", { mode: "number" })
  //   .notNull()
  //   .default(sql`extract(epoch from now())`),
});

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
    // modifiedAt: bigint("modified_at", { mode: "number" })
    //   .notNull()
    //   .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      pk: primaryKey({ columns: [t.set_uuid, t.tag_uuid] }),
    };
  }
);

export const Tag = table(
  "tag",
  {
    uuid: uuid("uuid").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    createdAt: bigint("created_at", { mode: "number" })
      .notNull()
      .default(sql`extract(epoch from now())`),
    // modifiedAt: bigint("modified_at", { mode: "number" })
    //   .notNull()
    //   .default(sql`extract(epoch from now())`),
  },
  (t) => {
    return {
      nameIdx: index("name_idx").on(t.name),
    };
  }
);
