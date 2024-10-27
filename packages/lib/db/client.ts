import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index";
import postgres from "postgres";

// export const newDB = () => {
//   const client = postgres(process.env.DATABASE_URL! as string, { max: 1 });
//   return drizzle(client, {
//     schema,
//     logger: true,
//   });
// };

// type DatabaseWithClose = ReturnType<typeof drizzle> & {
//   close: () => Promise<void>;
// };

export const newDB = () => {
  const client = postgres(process.env.DATABASE_URL! as string, { max: 1 });
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
