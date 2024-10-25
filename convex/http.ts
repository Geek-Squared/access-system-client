import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import util from "util";
import { Buffer } from "buffer";
import { SignJWT } from "jose";

if (typeof global !== "undefined") {
  global.Buffer = Buffer;
} else if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

declare global {
  var util: any;
}

if (typeof global !== "undefined") {
  global.util = util;
} else if (typeof window !== "undefined") {
  window.util = util;
}

const http = httpRouter();
const handleCorsOptions = (request: Request) => {
  const origin = request.headers.get("Origin") || "";

  if (origin && request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin", // Ensures responses vary based on the requesting origin
      },
      status: 204,
    });
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      Vary: "Origin",
    },
    status: 400,
  });
};

// Replace all explicit headers with dynamic CORS in every route response
const dynamicCORSHeaders = (request: Request) => ({
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": request.headers.get("Origin") || "*",
  "Access-Control-Allow-Credentials": "true",
  Vary: "Origin",
});

const clientOrigin =
  process.env.CLIENT_ORIGIN ||
  "https://accessme-admin.vercel.app" ||
  "https://app-admin-git-main-moses-projects-a42870f9.vercel.app/" ||
  "https://admin-access-khaki.vercel.app/";

const validateRequiredFields = (data: any, fields: string[]) => {
  for (const field of fields) {
    if (!data[field]) {
      return false;
    }
  }
  return true;
};

http.route({
  path: "/visitor",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const guests = await ctx.runQuery(api.visitor.get, {});
    return new Response(JSON.stringify(guests), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }),
});

http.route({
  path: "/visitor",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = [
      "name",
      "siteId",
      "security_personnel",
      "id_number",
      "phone_number",
      "visiting_resident",
      "visiting_reason",
      "on_site",
    ];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const guestId = await ctx.runMutation(
        api.functions.mutations.visitor.addVisitor,
        data
      );
      return new Response(
        JSON.stringify({ guestId, message: "Guest added successfully" }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/guests",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/signup",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["username", "email", "password", "role"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const userId = await ctx.runMutation(
        api.functions.mutations.user.signUp,
        data
      );
      return new Response(JSON.stringify({ userId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": clientOrigin,
          Vary: "origin",
        },
      });
    } catch (error: any) {
      if (error.message === "Email already in use") {
        return new Response(error.message, { status: 409 });
      }
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

http.route({
  path: "/signup",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

// Authenticate personnel

http.route({
  path: "/auth/personnel",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["phoneNumber", "pin"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("phone number or pin", { status: 400 });
    }

    try {
      const loginResponse = await ctx.runMutation(
        api.functions.mutations.authenticatePersonnel.authenticatePersonnel,
        data
      );
      return new Response(JSON.stringify(loginResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": clientOrigin,
        },
      });
    } catch (error: any) {
      return new Response(error.message, { status: 401 });
    }
  }),
});

http.route({
  path: "/auth/personnel",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/auth/admin",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["email", "password"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing email or password", { status: 400 });
    }

    try {
      const loginResponse = await ctx.runMutation(
        api.functions.mutations.authenticateAdmin.authenticateAdmin,
        data
      );
      return new Response(JSON.stringify(loginResponse), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": clientOrigin,
        },
      });
    } catch (error: any) {
      return new Response(error.message, { status: 401 });
    }
  }),
});

http.route({
  path: "/auth/admin",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/organization",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["name", "address", "createdBy"];

    if (
      !validateRequiredFields(data, requiredFields) ||
      !data.address.addressLineOne ||
      !data.address.city ||
      !data.address.country
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const organizationId = await ctx.runMutation(
        api.functions.mutations.organization.createOrganization,
        data
      );
      return new Response(JSON.stringify({ organizationId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": clientOrigin,
          Vary: "origin",
        },
      });
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/organization",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const orgs = await ctx.runQuery(api.organization.get, {});
    return new Response(JSON.stringify(orgs), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }),
});

http.route({
  path: "/organization",
  method: "PATCH",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const orgId = url.searchParams.get("id");

    if (!orgId) {
      return new Response("Organization ID is required", { status: 400 });
    }

    const data = await request.json();
    const fieldsToUpdate = data;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return new Response("No fields provided for update", { status: 400 });
    }

    try {
      //@ts-ignore
      const user = await ctx.runQuery(api.user.get, { id: orgId });

      if (!user) {
        return new Response("Organization not found", { status: 404 });
      }

      // Update the fields
      await ctx.runMutation(
        api.functions.mutations.organization.updateOrganization,
        {
          id: orgId,
          ...fieldsToUpdate,
        }
      );

      return new Response(
        JSON.stringify({ message: "Organization updated successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/organization",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/site",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const sites = await ctx.runQuery(api.sites.get, {});
    return new Response(JSON.stringify(sites), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }),
});

http.route({
  path: "/site",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["name", "organizationId", "address", "createdBy"];

    if (
      !validateRequiredFields(data, requiredFields) ||
      !data.address.street ||
      !data.address.city
    ) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const siteId = await ctx.runMutation(
        api.functions.mutations.site.createSite,
        data
      );
      return new Response(JSON.stringify({ siteId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": clientOrigin,
          Vary: "origin",
        },
      });
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/site/:siteId",
  method: "PATCH",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const siteId = url.searchParams.get("id");

    if (!siteId) {
      return new Response("Site ID is required", { status: 400 });
    }

    const data = await request.json();
    const fieldsToUpdate = data;

    if (Object.keys(fieldsToUpdate).length === 0) {
      return new Response("No fields provided for update", { status: 400 });
    }

    try {
      //@ts-ignore
      const user = await ctx.runQuery(api.user.get, { id: siteId });

      if (!user) {
        return new Response("Site not found", { status: 404 });
      }

      // Update the fields
      await ctx.runMutation(api.functions.mutations.site.updateSite, {
        id: siteId,
        ...fieldsToUpdate,
      });

      return new Response(
        JSON.stringify({ message: "Site updated successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/site/:siteId",
  method: "DELETE",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const siteId = url.searchParams.get("id");

    if (!siteId) {
      return new Response("Site ID is required", { status: 400 });
    }

    try {
      //@ts-ignore
      const site = await ctx.runQuery(api.site.get, { id: siteId });

      if (!site) {
        return new Response("Site not found", { status: 404 });
      }

      await ctx.runMutation(api.functions.mutations.site.deleteSite, {
        id: siteId,
      });

      return new Response(
        JSON.stringify({ message: "Site deleted successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/site",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/site/:siteId",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/user-personnel",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const personnel = await ctx.runQuery(api.personnel.get, {});
    return new Response(JSON.stringify(personnel), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }),
});

http.route({
  path: "/personnel",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["name", "organizationId", "phone_number", "siteId"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const personnelId = await ctx.runMutation(
        api.functions.mutations.personnel.createPersonnel,
        data
      );
      return new Response(JSON.stringify({ personnelId }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": clientOrigin,
          Vary: "origin",
        },
      });
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/user",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const user = await ctx.runQuery(api.user.get, {});
    return new Response(JSON.stringify(user), {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }),
});

http.route({
  path: "/currentUser",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("id");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    try {
      const user = await ctx.runQuery(api.user.getForCurrentUser, {
        //@ts-ignore
        id: userId,
      });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/currentUser",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/user",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["username", "role"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const userId = await ctx.runMutation(
        api.functions.mutations.user.signUp,
        data
      );
      return new Response(
        JSON.stringify({
          message: `${data.username} Successfully Created`,
          userId,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
            Vary: "origin",
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/user",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/invite-user",
  method: "POST",
  handler: httpAction(async (_, request) => {
    const data = await request.json();
    const requiredFields = ["email", "username"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const token = await new SignJWT({ email: data.email })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode("key"));
      console.log(token);
      return new Response(
        JSON.stringify({
          message: `Invitation sent to ${data.email}`,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
            Vary: "origin",
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/invite-user",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/user-personnel",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const data = await request.json();
    const requiredFields = ["username", "role"];

    if (!validateRequiredFields(data, requiredFields)) {
      return new Response("Missing required fields", { status: 400 });
    }

    try {
      const userId = await ctx.runMutation(
        api.functions.mutations.user.signUpPersonnel,
        data
      );
      return new Response(
        JSON.stringify({
          message: `${data.username} Successfully Created`,
          userId,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
            Vary: "origin",
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/user",
  method: "PATCH",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const data = await request.json();
    const fieldsToUpdate = data;

    // Ensure at least one field is provided for update
    if (Object.keys(fieldsToUpdate).length === 0) {
      return new Response("No fields provided for update", { status: 400 });
    }

    try {
      //@ts-ignore
      const user = await ctx.runQuery(api.user.get, { id: userId });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      // Update the fields
      await ctx.runMutation(api.functions.mutations.user.updateUser, {
        userId,
        ...fieldsToUpdate,
      });

      return new Response(
        JSON.stringify({ message: "User updated successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": clientOrigin,
          },
        }
      );
    } catch (error: any) {
      return new Response(error.message, { status: 500 });
    }
  }),
});

http.route({
  path: "/user/:userId",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

http.route({
  path: "/user-personnel",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => handleCorsOptions(request)),
});

export default http;
