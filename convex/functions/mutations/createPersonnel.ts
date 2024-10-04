import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const createPersonnel = mutation({
  args: v.object({
    userId: v.id("user"),
    siteId: v.id("site"),
    organizationId: v.id("organization"),
    phoneNumber: v.string(),
  }),
  handler: async (ctx, { userId, siteId, organizationId, phoneNumber }) => {
    const newPersonnel = {
      userId,
      siteId,
      organizationId,
      phoneNumber,
    };

    // Insert the new personnel record into the database
    const personnelId = await ctx.db.insert("personnel", newPersonnel);

    return personnelId;
  },
});
