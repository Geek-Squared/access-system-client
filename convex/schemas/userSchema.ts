import { v } from "convex/values";

export const userSchema = {
  username: v.string(),
  email: v.optional(v.string()),
  password: v.optional(v.string()),
  role: v.union(
    v.literal("admin"),
    v.literal("personnel"),
    v.literal("visitor")
  ),
  phoneNumber: v.optional(v.string()),
  pin: v.optional(v.string()),
  organizationId: v.optional(v.id("organization")),
};
