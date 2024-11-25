import { query } from "../_generated/server";

export const checkEmailExists = query(async (ctx, { email }: { email: string }) => {
  const existingUser = await ctx.db.query("user").filter(q => q.eq("email", email)).first();
  return existingUser ? true : false;
});
