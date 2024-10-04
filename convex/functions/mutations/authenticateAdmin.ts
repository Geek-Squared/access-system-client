import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { SignJWT } from "jose";

// Custom hashing function
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

export const authenticateAdmin = mutation({
  args: v.object({
    email: v.string(),
    password: v.string(),
  }),
  handler: async (ctx, { email, password }) => {
    const user = await ctx.db.query("user").filter(q => q.eq(q.field("email"), email)).first();
    if (!user || simpleHash(password) !== user.password || user.role !== "admin") {
      throw new Error("Invalid email or password");
    }

    // Generate a token for the user
    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(new TextEncoder().encode("key"));

    return {
      token,
      message: "Authentication successful",
      id: user._id,
    };
  },
});