import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as m } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema/index";
import { newClient } from "./client";

console.log("Starting migrations...");
const migrations = path.resolve(__dirname, "./migrations");

export const migrate = async (url: string) => {
  const client = newClient(url);
  await m(drizzle(client), {
    migrationsFolder: migrations,
  });

  const db = drizzle(client, {
    schema,
    logger: true,
  })
  await db.insert(schema.Ability).values({ keyword: "draw" });
  await db.insert(schema.Ability).values({ keyword: "pick" });

  await client.end();
};
