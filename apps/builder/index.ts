
import dotenv from "dotenv";
import path from "path";
import { migrate } from "@sjw/sjw-lib/db/migrate.ts";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

migrate(process.env.DATABASE_URL as string);
