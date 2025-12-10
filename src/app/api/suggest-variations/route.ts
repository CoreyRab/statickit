import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { analysis, aspectRatio, additionalContext } = await request.json();

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert advertising creative director specializing in ad variation testing for A/B tests. Your job is to suggest variations that test different creative angles while keeping the product IDENTICAL.

ORIGINAL AD ANALYSIS:
- Product/Service: ${analysis.product}
- Brand Style: ${analysis.brand_style}
- Visual Elements: ${analysis.visual_elements?.join(', ') || 'N/A'}
- Key Selling Points: ${analysis.key_selling_points?.join(', ') || 'N/A'}
- Target Audience: ${analysis.target_audience}
- Colors: ${analysis.colors?.join(', ') || 'N/A'}
- Current Mood: ${analysis.mood}
${additionalContext ? `\nADDITIONAL CONTEXT FROM ADVERTISER:\n${additionalContext}\n\nIMPORTANT: Use this context to tailor variations to the specific campaign goals, target audience, and brand voice mentioned above.` : ''}

GENERATE 4 VARIATIONS - one from each tier:

**TIER 1 - SCENE CHANGE** (1 variation)
Change the environment/location entirely. Examples:
- Home office → Coffee shop
- Desk setup → Outdoor patio table
- Studio setting → Living room couch
- Minimal background → Busy lifestyle scene

**TIER 2 - HUMAN ELEMENT** (1 variation)
Add a person or human presence. Examples:
- Hands reaching toward/using the product
- Person visible in background, blurred
- Over-the-shoulder POV perspective
- Someone's workspace with personal items

**TIER 3 - MOOD/ATMOSPHERE** (1 variation)
Change lighting, time of day, or styling. Examples:
- Warm golden hour sunset lighting
- Cool, professional morning light
- Cozy evening with lamp lighting
- Bright, energetic daylight

**TIER 4 - CONTEXT SHIFT** (1 variation)
Same product, different use-case or moment. Examples:
- "Getting started" moment vs "deep in work"
- Solo use vs collaborative/social setting
- Casual/relaxed vs professional/focused
- Morning routine vs late night session

CRITICAL RULES:
1. The product MUST remain EXACTLY the same - we only change what's AROUND it
2. **SCREEN RULE**: If there is a screen (phone, laptop, computer, monitor, TV, tablet) in the image, the content displayed on that screen must NOT be changed in ANY way. The screen content is sacred.
3. Each variation tests ONE hypothesis
4. Variations should be different enough to generate meaningful A/B test data

Return a JSON array with exactly 4 variations:
[
  {
    "title": "Short descriptive title (2-4 words)",
    "description": "Clear description of the change. Be specific about the new setting, lighting, or context. 2-3 sentences max."
  }
]

Return ONLY the JSON array, no other text.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse variations response');
    }

    const variations = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ variations });
  } catch (error) {
    console.error('Suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to suggest variations' },
      { status: 500 }
    );
  }
}
