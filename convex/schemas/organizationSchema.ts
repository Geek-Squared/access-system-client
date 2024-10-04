import { v } from "convex/values";

export const organizationSchema = {
  name: v.string(),
  createdBy: v.id("user"),
  logoUrl: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  address: v.object({
    addressLineOne: v.string(),
    addressLineTwo: v.optional(v.string()),
    postalCode: v.optional(v.number()),
    city: v.string(),
    country: v.string(),
  }),
  secondaryColor: v.optional(v.string()),
  users: v.optional(v.array(v.id("user"))),
  personnel: v.optional(v.array(v.id("user"))),
  sites: v.optional(v.array(v.id("site"))),
};
