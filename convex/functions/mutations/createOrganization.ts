import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const createOrganization = mutation({
  args: v.object({
    name: v.string(),
    logoUrl: v.optional(v.string()),
    createdBy: v.id("user"),
    primaryColor: v.optional(v.string()),
    personnel: v.optional(v.array(v.id("personnel"))),
    secondaryColor: v.optional(v.string()),
    sites: v.optional(v.array(v.id("site"))),
    address: v.object({
      addressLineOne: v.string(),
      addressLineTwo: v.optional(v.string()),
      postalCode: v.optional(v.number()),
      city: v.string(),
      country: v.string(),
    }),
    users: v.optional(v.array(v.id("user"))),
  }),
  handler: async (ctx, args) => {
    const newOrganization = {
      name: args.name,
      logoUrl: args.logoUrl || "",
      createdBy: args.createdBy,
      primaryColor: args.primaryColor || "",
      personnel: args.personnel || [],
      secondaryColor: args.secondaryColor || "",
      sites: args.sites || [],
      address: args.address,
      users: args.users || [],
    };

    const orgId = await ctx.db.insert("organization", newOrganization);

    return {
      message: `${args.name} Successfully Created`,
      orgId,
    };
  },
});
