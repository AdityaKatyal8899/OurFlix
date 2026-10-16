const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || ''
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || ''
const CASHFREE_ENV = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox'

const BASE_URL =
  CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'

export const CASHFREE_PRICING = {
  mini: {
    amount: 49.0,
    name: 'MyFlix Mini Reel (1 Year, 2 Rows, 20 Photos, 1 Video)',
    priceFormatted: '₹49/yr',
    period: '1 Year',
    rowLimit: 2,
    photoLimit: 20,
    videoLimit: 1,
    hasAudioIntro: false,
  },
  premier: {
    amount: 99.0,
    name: 'MyFlix Premier Blockbuster (1 Year, 4 Rows, 45 Photos, 5 Videos)',
    priceFormatted: '₹99/yr',
    period: '1 Year',
    rowLimit: 4,
    photoLimit: 45,
    videoLimit: 5,
    hasAudioIntro: true,
  },
  vip: {
    amount: 199.0,
    name: 'MyFlix VIP Box Set (1 Year, 8 Rows, 100 Photos, 15 Videos)',
    priceFormatted: '₹199/yr',
    period: '1 Year',
    rowLimit: 8,
    photoLimit: 100,
    videoLimit: 15,
    hasAudioIntro: true,
  },
} as const

export type CashfreePlanKey = keyof typeof CASHFREE_PRICING

export const CASHFREE_ADDONS = {
  addon_row_19: {
    id: 'addon_row_19',
    amount: 19.0,
    name: '+1 Extra Movie Row',
    priceFormatted: '₹19',
    type: 'row',
    value: 1,
    description: 'Add 1 additional category row to your stream.',
  },
  addon_photos_29: {
    id: 'addon_photos_29',
    amount: 29.0,
    name: '+10 Photos Booster Pack',
    priceFormatted: '₹29',
    type: 'photos',
    value: 10,
    description: 'Add capacity for 10 more high-resolution photo memories.',
  },
  addon_photos_59: {
    id: 'addon_photos_59',
    amount: 59.0,
    name: '+25 Super Photos Pack',
    priceFormatted: '₹59',
    type: 'photos',
    value: 25,
    description: 'Add capacity for 25 more photos for large albums.',
  },
  addon_videos_39: {
    id: 'addon_videos_39',
    amount: 39.0,
    name: '+3 Video Clips Pack',
    priceFormatted: '₹39',
    type: 'videos',
    value: 3,
    description: 'Add capacity for 3 more video highlight moments.',
  },
  addon_videos_79: {
    id: 'addon_videos_79',
    amount: 79.0,
    name: '+8 Video Director Pack',
    priceFormatted: '₹79',
    type: 'videos',
    value: 8,
    description: 'Add capacity for 8 video clips for mini movie compilations.',
  },
  addon_audio_29: {
    id: 'addon_audio_29',
    amount: 29.0,
    name: 'Custom Soundtrack / Audio Intro',
    priceFormatted: '₹29',
    type: 'audio',
    value: 1,
    description: 'Unlock background soundtrack & custom intro chime.',
  },
  renew_hosting_49: {
    id: 'renew_hosting_49',
    amount: 49.0,
    name: 'Extend 1 Year Cloud Hosting',
    priceFormatted: '₹49/yr',
    type: 'extension',
    value: 365,
    description: 'Extends private cloud streaming and domain link for 365 days.',
  },
} as const

export type CashfreeAddonKey = keyof typeof CASHFREE_ADDONS

export interface CreateOrderParams {
  orderId: string
  amount: number
  customerId: string
  customerPhone?: string
  customerEmail?: string
  customerName?: string
  returnUrl: string
  notifyUrl?: string
  orderNote?: string
  tags?: Record<string, string>
}

export interface CashfreeOrderResponse {
  cf_order_id: string
  order_id: string
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED'
  order_amount: number
  order_currency: string
  payment_session_id: string
  order_tags?: Record<string, string>
}

export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CashfreeOrderResponse> {
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    throw new Error('Cashfree credentials are missing in environment variables.')
  }

  const payload = {
    order_id: params.orderId,
    order_amount: params.amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: params.customerId,
      customer_phone: params.customerPhone || '9999999999',
      customer_email: params.customerEmail || 'creator@myflix.com',
      customer_name: params.customerName || 'MyFlix Creator',
    },
    order_meta: {
      return_url: params.returnUrl,
      ...(params.notifyUrl ? { notify_url: params.notifyUrl } : {}),
    },
    order_note: params.orderNote || 'MyFlix Personalized Stream',
    ...(params.tags ? { order_tags: params.tags } : {}),
  }

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = data.message || data.error || 'Failed to create Cashfree order'
    throw new Error(errorMsg)
  }

  return data as CashfreeOrderResponse
}

export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    throw new Error('Cashfree credentials are missing in environment variables.')
  }

  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = data.message || data.error || 'Failed to fetch Cashfree order'
    throw new Error(errorMsg)
  }

  return data as CashfreeOrderResponse
}
