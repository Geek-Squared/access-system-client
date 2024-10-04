import { defineSchema, defineTable } from "convex/server";
import { visitorSchema } from "./schemas/visitorSchema";
import { qrCodeSchema } from "./schemas/qrCodeSchema";
import { siteSchema } from "./schemas/siteSchema";
import { userSchema } from "./schemas/userSchema";
import { organizationSchema } from "./schemas/organizationSchema";
import { personnelSchema } from "./schemas/personnelSchema";

export default defineSchema({
  user: defineTable(userSchema),
  visitor: defineTable(visitorSchema),
  qrCode: defineTable(qrCodeSchema),
  site: defineTable(siteSchema),
  organization: defineTable(organizationSchema),
  personnel: defineTable(personnelSchema),
});
