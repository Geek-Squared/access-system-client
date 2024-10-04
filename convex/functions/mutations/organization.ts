import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const createOrganization = mutation({
  args: v.object({
    name: v.string(),
    logoUrl: v.optional(v.string()),
    createdBy: v.id("user"),
    primaryColor: v.optional(v.string()),
    personnel: v.optional(v.array(v.string())),
    secondaryColor: v.optional(v.string()),
    sites: v.optional(v.array(v.string())),
    address: v.object({
      addressLineOne: v.string(),
      addressLineTwo: v.optional(v.string()),
      postalCode: v.optional(v.number()),
      city: v.string(),
      country: v.string(),
    }),
    users: v.optional(v.array(v.string())),
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

export const updateOrganization = mutation(
  async (ctx, { id, ...fieldsToUpdate }: any) => {
    try {
      const org = await ctx.db.get(id);
      if (!org) {
        throw new Error("Organization not found");
      }

      // Merge new values with existing arrays
      const updatedFields = { ...fieldsToUpdate };

      if (fieldsToUpdate.personnel) {
        updatedFields.personnel = [
          //@ts-expect-error
          ...(org?.personnel || []),
          ...fieldsToUpdate.personnel,
        ];
      }

      if (fieldsToUpdate.users) {
        updatedFields.users = [
          //@ts-expect-error
          ...(org.users || []),
          ...fieldsToUpdate.users,
        ];
      }

      if (fieldsToUpdate.sites) {
        updatedFields.sites = [
          //@ts-expect-error
          ...(org.sites || []),
          ...fieldsToUpdate.sites,
        ];
      }

      // Update only the provided fields
      await ctx.db.patch(id, updatedFields);
      return { message: "Organization updated successfully" };
    } catch (error: any) {
      throw new Error("Update failed: " + error.message);
    }
  }
);

