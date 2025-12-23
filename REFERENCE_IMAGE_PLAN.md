# Reference Image Feature Plan

## Overview
Allow users to upload a reference image when using Edit, Backgrounds, or Models tools. Instead of describing what they want, they can show an example and the AI will extract the relevant elements.

---

## Use Cases

### Backgrounds Tool
- Upload a photo of a location → "Use this background"
- Upload a mood board image → "Match this lighting/atmosphere"
- Upload a competitor's ad → "Similar environment to this"

### Models Tool
- Upload a photo of a person → "Use a model that looks like this"
- Upload a casting reference → "Similar age/ethnicity/style to this person"

### Edit Tool
- Upload a reference for color grading → "Match these colors"
- Upload a layout reference → "Arrange elements like this"
- Upload a style reference → "Apply this visual style"

---

## UI Design

### Reference Image Button
Add a small image upload button next to the text input on each tool:

```
┌─────────────────────────────────────────────────────┐
│ [📷] Describe your changes...                   [→] │
└─────────────────────────────────────────────────────┘
```

When clicked:
1. Opens file picker (accept: image/*)
2. Shows thumbnail preview with X to remove
3. Text input becomes optional (can use reference alone or with text)

```
┌─────────────────────────────────────────────────────┐
│ ┌──────┐                                            │
│ │ img  │ ✕  "Make background similar to this"  [→] │
│ └──────┘                                            │
└─────────────────────────────────────────────────────┘
```

### State Variables to Add (page.tsx)
```typescript
// Reference images for each tool
const [editReferenceImage, setEditReferenceImage] = useState<{
  file: File;
  url: string;
  base64?: string;
} | null>(null);

const [backgroundReferenceImage, setBackgroundReferenceImage] = useState<{
  file: File;
  url: string;
  base64?: string;
} | null>(null);

const [modelReferenceImage, setModelReferenceImage] = useState<{
  file: File;
  url: string;
  base64?: string;
} | null>(null);
```

---

## API Changes

### Option A: Separate Analysis + Generation (Recommended)
Two-step process for better control:

1. **New endpoint: `/api/analyze-reference`**
   - Receives: reference image + type (background/model/style)
   - Returns: detailed text description extracted by AI

2. **Existing `/api/generate` endpoint**
   - Receives: original image + extracted description
   - Works as before, just with AI-generated description

**Pros**: Reuses existing generation logic, user can edit the extracted description
**Cons**: Extra API call, slightly slower

### Option B: Direct Multi-Image Generation
Single request with both images:

1. **Update `/api/generate` endpoint**
   - Add optional `referenceImage` and `referenceType` parameters
   - Prompt includes both images with instructions

**Pros**: Single API call, faster
**Cons**: More complex prompts, less user control

---

## Prompt Templates

### Background Reference Prompt
```
You have two images:
1. MAIN IMAGE: The product/subject image to modify
2. REFERENCE IMAGE: A background/environment to replicate

Extract the background from the REFERENCE IMAGE and apply it to the MAIN IMAGE.

WHAT TO EXTRACT FROM REFERENCE:
- Location/setting type
- Lighting direction, color, and intensity
- Atmosphere and mood
- Key environmental elements
- Color palette

WHAT TO PRESERVE FROM MAIN IMAGE:
- The product/subject exactly as shown
- Any people/models exactly as shown
- Relative positioning and scale

Generate a new image with the main subject in the reference environment.
```

### Model Reference Prompt
```
You have two images:
1. MAIN IMAGE: The current advertising image
2. REFERENCE IMAGE: A person to use as model reference

Replace the model in the MAIN IMAGE with someone matching the REFERENCE.

WHAT TO MATCH FROM REFERENCE:
- Approximate age range
- Ethnicity and skin tone
- Hair color, length, and style
- Body type and build
- Overall aesthetic/vibe

WHAT TO PRESERVE FROM MAIN IMAGE:
- Exact same pose and position
- Same facial expression and emotion
- Background, lighting, and product unchanged
- Clothing (unless specified otherwise)

The new model should look natural in the scene, not composited.
```

### Style Reference Prompt (Edit Tool)
```
You have two images:
1. MAIN IMAGE: The image to modify
2. REFERENCE IMAGE: A style reference

Apply the visual style from the REFERENCE to the MAIN IMAGE.

WHAT TO EXTRACT FROM REFERENCE:
- Color grading and palette
- Contrast and exposure style
- Mood and atmosphere
- Any distinctive visual treatment

WHAT TO PRESERVE FROM MAIN IMAGE:
- All content and composition
- Product appearance and details
- People/models exactly as shown

Apply the reference style while keeping content unchanged.
```

---

## Implementation Steps

### Phase 1: UI Components
1. Create `ReferenceImageUpload` component
   - Compact upload button with preview
   - Drag & drop support
   - Remove button

2. Add to Edit tool input area
3. Add to Backgrounds tool (above suggestion button)
4. Add to Models tool (above suggestion button)

### Phase 2: API - Analysis Endpoint
1. Create `/api/analyze-reference/route.ts`
2. Accept image + type parameter
3. Return structured description

### Phase 3: Integration
1. Update `handleEditSubmit` to check for reference image
2. Update `handleApplyBackgroundChange` for reference mode
3. Update `handleApplyModelChange` for reference mode
4. Add "Use reference" quick action buttons

### Phase 4: Polish
1. Loading states during analysis
2. Preview of extracted description (editable)
3. Clear reference when switching tools
4. Persist reference across generations

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Add state, UI components, handlers |
| `src/app/api/analyze-reference/route.ts` | NEW - Extract descriptions from reference |
| `src/app/api/generate/route.ts` | Add optional referenceImage handling |
| `src/components/ReferenceImageUpload.tsx` | NEW - Reusable upload component |

---

## Open Questions

1. **Should extracted descriptions be editable?**
   - Pro: User can refine what AI extracted
   - Con: Extra step, more complex UI

2. **Store references in session?**
   - Could allow "use same reference" across multiple generations

3. **Reference image size limits?**
   - Full resolution not needed for reference
   - Could auto-resize to save bandwidth

4. **Multi-image references?**
   - e.g., "Background from image A, lighting from image B"
   - Complexity vs. value tradeoff

---

## Priority
Medium - Nice to have feature that would significantly improve the creative workflow for users who have specific visual references in mind.
