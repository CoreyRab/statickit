# StaticKit Setup Status

## Completed

### Phase 1: Core App
- [x] Next.js 16 + TypeScript setup
- [x] Clerk authentication integration
- [x] Convex database for persistence
- [x] Image upload and analysis (Google AI)
- [x] Variation generation with Imagen 3
- [x] AI-powered image resizing
- [x] Version history for edits
- [x] Landing page with pricing

### Phase 2: Security
- [x] Auth checks on all API routes
- [x] Rate limiting infrastructure (Upstash ready)
- [x] Input validation

### Phase 3: Billing (Code Complete)
- [x] Stripe integration code
  - `/src/app/api/stripe/checkout/route.ts`
  - `/src/app/api/stripe/webhook/route.ts`
  - `/src/app/api/stripe/portal/route.ts`
- [x] Credit system in Convex (`convex/users.ts`)
- [x] Plan selection modal after sign-up
- [x] Settings page with billing management
- [x] No free tier - subscription required

## Pending Configuration

### Stripe Setup (Required)
1. Create Stripe account at https://dashboard.stripe.com
2. Create 3 products with monthly prices:
   - Starter: $19/month
   - Pro: $49/month
   - Ultra: $99/month
3. Get API keys from Developers → API Keys:
   - Secret key: `sk_test_...` or `sk_live_...`
   - Publishable key: `pk_test_...` or `pk_live_...`
4. Copy Price IDs from each product (starts with `price_...`)
5. Create webhook endpoint:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`
   - Copy signing secret: `whsec_...`

### Environment Variables Needed
```env
# Stripe (get from dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ULTRA=price_...
```

### Local Testing with Stripe CLI
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Use the webhook signing secret it provides
```

## Pricing Structure

| Plan | Price | Credits/Month |
|------|-------|---------------|
| Starter | $19 | 30 iterations |
| Pro | $49 | 300 iterations |
| Ultra | $99 | 800 iterations |

## Sign-Up Flow
1. User uploads image → goes to editor
2. User tries to generate → sign-up modal appears
3. User signs up via Clerk → plan selection modal appears
4. User selects plan → redirects to Stripe checkout
5. After payment → webhook updates subscription
6. User returns with active subscription

## Next Steps
- [ ] Complete Stripe dashboard setup
- [ ] Add environment variables
- [ ] Test checkout flow end-to-end
- [ ] Deploy to Vercel
- [ ] Configure production webhook URL
