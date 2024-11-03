import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";
import postgres from "postgres";


export const newClient = (url: string):postgres.Sql<{}>  => {
  return postgres(url, { max: 1 });
};

export const newDB = (url: string) => {
  const client = newClient(url);
  const db = drizzle(client, {
    schema,
    logger: true,
  });

  // Extend `db` with a `close` method that ends the client connection
  return Object.assign(db, {
    close: async () => {
      await client.end();
    },
  });
};
