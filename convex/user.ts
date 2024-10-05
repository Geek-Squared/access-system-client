import { v } from "convex/values";
import { query } from "./_generated/server";

export const getForCurrentUser = query({
  args: { id: v.id("user") },
  handler: async (ctx, { id }) => {
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
    return user;
  },
});

export const get = query(async ({ db }) => {
  return await db.query("user").collect();
});
