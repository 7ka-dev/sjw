import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as m } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema/index";
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL! as string, { max: 1 });
const migrations = path.resolve(__dirname, "./migrations");

export const migrate = async () => {
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
