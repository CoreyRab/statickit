import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all generations for a user
export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return generations;
  },
});

// Create a new generation
export const create = mutation({
  args: {
    originalImageUrl: v.string(),
    originalFilename: v.string(),
    aspectRatio: v.string(),
    analysis: v.object({
      product: v.string(),
      brand_style: v.string(),
      visual_elements: v.array(v.string()),
      key_selling_points: v.array(v.string()),
      target_audience: v.string(),
      colors: v.array(v.string()),
      mood: v.string(),
    }),
    variations: v.array(
      v.object({
        id: v.string(),
        title: v.string(),
        description: v.string(),
        image_url: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const generationId = await ctx.db.insert("generations", {
      userId: identity.subject,
      originalImageUrl: args.originalImageUrl,
      originalFilename: args.originalFilename,
      aspectRatio: args.aspectRatio,
      analysis: args.analysis,
      variations: args.variations,
    });

    return generationId;
  },
});

// Delete a generation
export const remove = mutation({
  args: { id: v.id("generations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const generation = await ctx.db.get(args.id);
    if (!generation || generation.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.id);
  },
});
