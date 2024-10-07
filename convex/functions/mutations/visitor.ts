import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const addVisitor = mutation({
  args: v.object({
    name: v.string(),
    siteId: v.id("site"),
    security_personnel: v.id("user"),
    id_number: v.string(),
    phoneNumber: v.string(),
    visiting_resident: v.string(),
    visiting_reason: v.string(),
    license_reg_number: v.optional(v.string()),
  vehicle_make: v.optional(v.string()),
    entry_time: v.optional(v.string()),
    exit_time: v.optional(v.string()),
    on_site: v.boolean(),
  }),
  handler: async (
    ctx,
    {
      name,
      siteId,
      security_personnel,
      id_number,
      phoneNumber,
      visiting_resident,
      visiting_reason,
      license_reg_number,
      vehicle_make,
      entry_time,
      exit_time,
      on_site,
    }
  ) => {
    const newVisitor = {
      name,
      siteId,
      security_personnel,
      id_number,
      phoneNumber,
      visiting_resident,
      visiting_reason,
      license_reg_number,
      vehicle_make,
      entry_time,
      exit_time,
      on_site,
    };

    const guestId = await ctx.db.insert("visitor", newVisitor);
    return guestId;
  },
});

export const updateVisitor = mutation({
  args: v.object({
    id: v.id("visitor"),
    organizationId: v.optional(v.string()),
    siteId: v.optional(v.string()),
    name: v.optional(v.string()),
    id_number: v.optional(v.string()),
    visiting_reason: v.optional(v.string()),
    visiting_resident: v.optional(v.string()),
    license_reg_number: v.optional(v.string()),
    vehicle_make: v.optional(v.string()),
    on_site: v.boolean(),
    entry_time: v.optional(v.string()),
    exit_time: v.optional(v.string()),
    phone_number: v.optional(v.string()),
  }),
  handler: async (ctx, args: any) => {
    const { id, ...fields } = args;

    // Log the visitor before updating
    console.log(await ctx.db.get(id));

    // Update the visitor with the fields provided
    await ctx.db.patch(id, fields);

    // Log the updated visitor
    const updatedVisitor = await ctx.db.get(id);
    console.log(updatedVisitor);

    return updatedVisitor;
  },
});
