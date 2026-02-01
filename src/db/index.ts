import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Get database URL from environment variable
const databaseUrl = process.env.DATABASE_URL;

let db: NeonHttpDatabase<typeof schema>;

if (databaseUrl) {
  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
} else {
  // Create a mock db for build time - will throw if actually used
  db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get() {
      throw new Error(
        "DATABASE_URL environment variable is not set. Please check your .env file.",
      );
    },
  });
}

export { db };

// Export all schema for convenience
export * from "./schema";
