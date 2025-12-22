import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add email to waitlist
export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return { success: true, alreadyExists: true };
    }

    // Add to waitlist
    await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase(),
      createdAt: Date.now(),
      source: args.source,
    });

    return { success: true, alreadyExists: false };
  },
});

// Get waitlist count (for admin)
export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("waitlist").collect();
    return all.length;
  },
});

// Get all waitlist entries (for admin)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("waitlist")
      .order("desc")
      .collect();
  },
});
