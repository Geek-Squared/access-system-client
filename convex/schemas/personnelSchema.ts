import { v } from "convex/values";

export const personnelSchema = {
  userId: v.id("user"),
  siteId: v.id("site"),
  organizationId: v.id("organization"),
  phoneNumber: v.string(),
};
