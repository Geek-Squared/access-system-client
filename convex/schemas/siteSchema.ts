import { v } from "convex/values";

export const siteSchema = {
  name: v.string(),
  organizationId: v.id("organization"),
  createdBy: v.id("user"),
  address: v.object({
    street: v.string(),
    city: v.string(),
  }),
  personnel: v.optional(v.array(v.id("user"))),
  visitors: v.optional(v.array(v.id("visitor"))),
};
