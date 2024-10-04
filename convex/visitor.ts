// convex/guests.ts
import { query } from "./_generated/server";

// Define the `getGuests` query
export const get = query(async ({ db }) => {
  return await db.query("visitor").collect();
});
