import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const createVisitor = mutation({
  args: v.object({
    organizationId: v.optional(v.id("organization")),
    siteId: v.optional(v.id("site")),
    name: v.string(),
    id_number: v.string(),
    visiting_reason: v.string(),
    visiting_resident: v.string(),
    on_site: v.boolean(),
    entry_time: v.optional(v.string()),
    exit_time: v.optional(v.string()),
    phone_number: v.optional(v.string()),
  }),
  handler: async (ctx, args: any) => {
    const identity = ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const newVisitor = await ctx.db.insert("visitor", args);
    return newVisitor;
  },
});

export const updateVisitor = mutation({
  args: v.object({
    id: v.id("guests"),
    organizationId: v.optional(v.string()),
    siteId: v.optional(v.string()),
    name: v.optional(v.string()),
    id_number: v.optional(v.string()),
    visiting_reason: v.optional(v.string()),
    visiting_resident: v.optional(v.string()),
    on_site: v.boolean(),
    entry_time: v.optional(v.string()),
    exit_time: v.optional(v.string()),
    phone_number: v.optional(v.string()),
  }),
  handler: async (ctx, args: any) => {
    const { id, ...fields } = args;

    // Update the visitor with the fields provided
    await ctx.db.patch(id, fields);

    // Log the updated visitor
    const updatedVisitor = await ctx.db.get(id);

    return updatedVisitor;
  },
});
