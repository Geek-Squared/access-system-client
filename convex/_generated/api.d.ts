/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as functions_mutations_authenticateAdmin from "../functions/mutations/authenticateAdmin.js";
import type * as functions_mutations_authenticatePersonnel from "../functions/mutations/authenticatePersonnel.js";
import type * as functions_mutations_guest from "../functions/mutations/guest.js";
import type * as functions_mutations_organization from "../functions/mutations/organization.js";
import type * as functions_mutations_personnel from "../functions/mutations/personnel.js";
import type * as functions_mutations_site from "../functions/mutations/site.js";
import type * as functions_mutations_user from "../functions/mutations/user.js";
import type * as functions_mutations_visitor from "../functions/mutations/visitor.js";
import type * as http from "../http.js";
import type * as invalid from "../invalid.js";
import type * as organization from "../organization.js";
import type * as personnel from "../personnel.js";
import type * as schemas_organizationSchema from "../schemas/organizationSchema.js";
import type * as schemas_personnelSchema from "../schemas/personnelSchema.js";
import type * as schemas_qrCodeSchema from "../schemas/qrCodeSchema.js";
import type * as schemas_siteSchema from "../schemas/siteSchema.js";
import type * as schemas_userSchema from "../schemas/userSchema.js";
import type * as schemas_visitorSchema from "../schemas/visitorSchema.js";
import type * as sites from "../sites.js";
import type * as user from "../user.js";
import type * as utils_checkEmail from "../utils/checkEmail.js";
import type * as utils_generateToken from "../utils/generateToken.js";
import type * as utils_normalizaPhoneNumber from "../utils/normalizaPhoneNumber.js";
import type * as visitor from "../visitor.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "functions/mutations/authenticateAdmin": typeof functions_mutations_authenticateAdmin;
  "functions/mutations/authenticatePersonnel": typeof functions_mutations_authenticatePersonnel;
  "functions/mutations/guest": typeof functions_mutations_guest;
  "functions/mutations/organization": typeof functions_mutations_organization;
  "functions/mutations/personnel": typeof functions_mutations_personnel;
  "functions/mutations/site": typeof functions_mutations_site;
  "functions/mutations/user": typeof functions_mutations_user;
  "functions/mutations/visitor": typeof functions_mutations_visitor;
  http: typeof http;
  invalid: typeof invalid;
  organization: typeof organization;
  personnel: typeof personnel;
  "schemas/organizationSchema": typeof schemas_organizationSchema;
  "schemas/personnelSchema": typeof schemas_personnelSchema;
  "schemas/qrCodeSchema": typeof schemas_qrCodeSchema;
  "schemas/siteSchema": typeof schemas_siteSchema;
  "schemas/userSchema": typeof schemas_userSchema;
  "schemas/visitorSchema": typeof schemas_visitorSchema;
  sites: typeof sites;
  user: typeof user;
  "utils/checkEmail": typeof utils_checkEmail;
  "utils/generateToken": typeof utils_generateToken;
  "utils/normalizaPhoneNumber": typeof utils_normalizaPhoneNumber;
  visitor: typeof visitor;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
