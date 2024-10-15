import { v } from "convex/values";
import { mutation } from "../../_generated/server";
import { Id } from "../../_generated/dataModel";

export const createSite = mutation({
  args: v.object({
    name: v.string(),
    organizationId: v.id("organization"),
    createdBy: v.id("user"),
    address: v.object({
      street: v.string(),
      city: v.string(),
    }),
    personnel: v.optional(v.array(v.string())),
    visitors: v.optional(v.array(v.string())),
  }),
  handler: async (
    ctx,
    { name, organizationId, createdBy, address }
  ) => {
    const newSite = {
      name,
      organizationId,
      createdBy,
      address,
      personnel: [],
      visitors: [],
    };

    // Insert the new site record into the database
    const siteId: Id<"site"> = await ctx.db.insert("site", newSite);

    return siteId;
  },
});

export const updateSite = mutation(
  async (ctx, { id, ...fieldsToUpdate }: any) => {
    try {
      const site = await ctx.db.get(id);
      if (!site) {
        throw new Error("Site not found");
      }

      // Update only the provided fields
      await ctx.db.patch(id, fieldsToUpdate);
      return { message: "Site updated successfully" };
    } catch (error: any) {
      throw new Error("Update failed: " + error.message);
    }
  }
);

export const deleteSite = mutation(
  async (ctx, { id }: any) => {
    try {
      const site = await ctx.db.get(id);
      if (!site) {
        throw new Error("Site not found");
      }

      await ctx.db.delete(id);
      return { message: "Site deleted successfully" };
    } catch (error: any) {
      throw new Error("Delete failed: " + error.message);
    }
  }
)