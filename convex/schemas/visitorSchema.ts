import { v } from "convex/values";

export const visitorSchema = {
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

  customFields: v.optional(v.record(v.string(), v.any())),
};
