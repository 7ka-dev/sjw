import path from "path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate as m } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

const client = postgres(process.env.DATABASE_URL! as string, { max: 1 });
const migrations = path.resolve(__dirname, "./migrations");

export const migrate = async () => {
  await m(drizzle(client), {
    migrationsFolder: migrations,
  });

  await client.end();
};
