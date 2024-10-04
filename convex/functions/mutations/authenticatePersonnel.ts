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

export const authenticatePersonnel = mutation({
  args: v.object({
    phoneNumber: v.string(),
    pin: v.string(),
  }),
  handler: async (ctx, { phoneNumber, pin }) => {
    // Fetch user by phone number
    const user = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("phoneNumber"), phoneNumber as string))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Hash the provided pin
    const hashedPin = simpleHash(pin);

    // Check if the hashed pin matches the stored pin
    if (!user.pin || hashedPin !== user.pin || user.role !== "personnel") {
      throw new Error("Invalid phone number or PIN");
    }

    // Generate a token if authentication is successful
    const token = await new SignJWT({ phoneNumber: user.phoneNumber })
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
