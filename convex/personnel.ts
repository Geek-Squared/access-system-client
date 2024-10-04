import { query } from "./_generated/server";

export const get = query(async ({ db }) => {
  const personnelUsers = await db
    .query("user")
    .filter((q) => q.eq(q.field("role"), "personnel"))
    .collect();

  return personnelUsers;
});
