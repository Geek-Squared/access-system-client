import { mutation } from "../../_generated/server";
import { SignJWT } from "jose";
import sgMail from "@sendgrid/mail";
import { userSchema } from "../../schemas/userSchema";
import { v } from "convex/values";

// Custom hashing function
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString();
}


export const sendInvitationEmail = async (
  email: string,
  username: string,
  token: string
) => {
  const msg = {
    to: email,
    from: "msngwelz@gmail.com",
    subject: "Invitation to Join",
    text: `Hello ${username},\n\nYou have been invited to join. Please use the following token to complete your registration: ${token}\n\nBest regards,\nYour Team`,
  };

  try {
    await sgMail.send(msg);
    console.log("Invitation email sent successfully");
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
};

export const signUp = mutation(
  async (ctx, { username, email, password, role, phoneNumber, pin }: any) => {
    try {
      const existingUser = await ctx.db
        .query("user")
        .filter((q) =>
          q.or(
            q.eq(q.field("email"), email),
            q.eq(q.field("phoneNumber"), phoneNumber as string)
          )
        )
        .first();

      if (existingUser?.email === email) {
        throw new Error("Email already in use");
      }

      // Hash the password and pin before storing them
      const hashedPassword = simpleHash(password);
      const hashedPin = pin ? simpleHash(pin) : undefined;

      // Insert the user into the database with the normalized lowercase email
      const userId = await ctx.db.insert("user", {
        username: username as string,
        email,
        password: hashedPassword,
        role: role as "admin" | "personnel" | "visitor",
        phoneNumber: phoneNumber as string,
        pin: hashedPin,
      });

      return {
        userId,
        message: "Sign-up successful",
        hashedPin,
      };
    } catch (error: any) {
      throw new Error("Sign-up failed: " + error.message);
    }
  }
);

export const signUpPersonnel = mutation(
  async (ctx, { username, role, phoneNumber, pin, organizationId }: any) => {
    try {
      const existingUser = await ctx.db
        .query("user")
        .filter((q) => q.or(q.eq(q.field("phoneNumber"), phoneNumber)))
        .first();

      if (existingUser?.phoneNumber === phoneNumber) {
        throw new Error("Phone Number already in use");
      }

      // Hash the password and pin before storing them
      const hashedPin = pin ? simpleHash(pin) : undefined;

      // Insert the user into the database with the normalized lowercase email
      const userId = await ctx.db.insert("user", {
        username: username as string,
        role: role as "admin" | "personnel" | "visitor",
        phoneNumber: phoneNumber as string,
        pin: hashedPin,
        organizationId: organizationId,
      });

      return {
        userId,
        message: "Sign-up successful",
        hashedPin,
      };
    } catch (error: any) {
      throw new Error("Sign-up failed: " + error.message);
    }
  }
);

export const login = mutation(async (ctx, { email, password }: any) => {
  // Check if the user exists with the provided email
  const user = await ctx.db
    .query("user")
    .filter((q) => q.eq(q.field("email"), email as string))
    .first();

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Hash the provided password and compare with the stored hashed password
  const hashedPassword = simpleHash(password);
  const passwordMatches = hashedPassword === user.password;

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  // At this point, the user is authenticated
  // Generate a token for the user
  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode("key"));

  return {
    token,
    message: "Login successful",
  };
});

export const createUser = mutation({
  args: v.object(userSchema),
  handler: async (ctx, args) => {
    // Check if the email already exists
    const existingUser = await ctx.db
      .query("user")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash the password and pin if provided
    const hashedPassword = args.password
      ? simpleHash(args.password)
      : undefined;
    const hashedPin = args.pin ? simpleHash(args.pin) : undefined;

    // Store the hashed password and pin
    const newUser = {
      ...args,
      password: hashedPassword,
      pin: hashedPin,
    };

    const userId = await ctx.db.insert("user", newUser);
    return userId;
  },
});

export const updateUser = mutation(
  async (ctx, { userId, ...fieldsToUpdate }: any) => {
    try {
      const user = await ctx.db.get(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Update only the provided fields
      await ctx.db.patch(userId, fieldsToUpdate);
      return { message: "User updated successfully" };
    } catch (error: any) {
      throw new Error("Update failed: " + error.message);
    }
  }
);
