import { query } from "./_generated/server";

export const get = query(async ({ db }) => {
  return await db.query("site").collect();
});
