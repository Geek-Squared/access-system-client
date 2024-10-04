import { defineSchema, defineTable } from "convex/server";
import { visitorSchema } from "./schemas/visitorSchema";
import { qrCodeSchema } from "./schemas/qrCodeSchema";
import { siteSchema } from "./schemas/siteSchema";
import { userSchema } from "./schemas/userSchema";
import { organizationSchema } from "./schemas/organizationSchema";
import { authTables } from "@convex-dev/auth/server";
import { personnelSchema } from "./schemas/personnelSchema";

export default defineSchema({
  ...authTables,
  user: defineTable(userSchema),
  visitor: defineTable(visitorSchema),
  qrCode: defineTable(qrCodeSchema),
  site: defineTable(siteSchema),
  organization: defineTable(organizationSchema),
  personnel: defineTable(personnelSchema),
});
