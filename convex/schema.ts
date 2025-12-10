import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  generations: defineTable({
    userId: v.string(),
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
  }).index("by_user", ["userId"]),
});
