import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder'

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
})

export const PLAN_PRICING = {
  mini: {
    amountInPaise: 4900, // ₹49
    name: 'MyFlix Mini Reel (2 Rows, 20 Items)',
    priceFormatted: '₹49',
  },
  premier: {
    amountInPaise: 9900, // ₹99
    name: 'MyFlix Premier Blockbuster (4 Rows, 50 Items, Full Customization)',
    priceFormatted: '₹99',
  },
  vip: {
    amountInPaise: 19900, // ₹199
    name: 'MyFlix VIP Box Set (Unlimited Rows, 4K Video, Keepsake Domain)',
    priceFormatted: '₹199',
  },
} as const

export type PlanKey = keyof typeof PLAN_PRICING
